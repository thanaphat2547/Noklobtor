//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 51; //width/height ratio = 408/228 = 17/12
let birdHeight = 36;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 80;
let pipeHeight = 500;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -1.3;
let velocityY = 0;
let gravity= 0.455;

let gameOver = false;
let score = 0;
let highscore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./Pic/newBird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./Pic/newTopPipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Pic/newBottomPipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2500); //2.5 sec interval
   //document.addEventListener("keydown", moveBird);
   document.addEventListener("mousedown", moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);
    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    
    //เกินความสูงเกินขอบจะเเพ้
    if(bird.y > board.height){
       gameOver = true;
    }

    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    //CLear pipe
    //shift is medthod ลดค่าลงเรื่อยๆจนกว่าจะเป็นค่าเริ่มต้น
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //Text
    context.fillStyle = "white";
    context.font = "45px sans-serif";   
    context.fillText(`Score: ${score}`,5,45);
    context.font = "20px sans-serif";
    
    context.fillText(`High Score: ${highscore}`, 5,65)

    if(gameOver){
        context.fillText("GAME OVER",5,90);
        if(score > highscore){
            highscore = score;
        }
        resetGame();
    }
}

function detectCollision(a,b){
    return  a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
            a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y; 
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    // Check if the mouse is clicked
    if (e.type === "mousedown") {
        // Jump when the mouse is clicked
        velocityY = -7.0;

        // Reset the game if it's over
        if (gameOver) {
           bird.y = birdY;
            pipeArray = [];
          score = 0;
           gameOver = false;
        }
    }
}

