const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const board = [];
const scoreElement = document.getElementById("socre");
const speedElement = document.getElementById("speed");
const bgm = document.createElement("audio");
const breakSound = document.createElement("audio");
const drop = document.createElement("audio");
let score = 0;
let speed = 1000;
let rotatedShape;
var gameOver = true;



document.getElementById("speed").textContent = "Speed: " + speed;

bgm.setAttribute("src" , "./assets/audio/bgm.mp3");
bgm.muted = true;

breakSound.setAttribute("src" , "./assets/audio/break.mp3");
bgm.muted = true;

breakSound.setAttribute('src' , "./assets/audio/drop.mp3");
bgm.muted = true;

//Criação do Tabuleiro
for(let row = 0 ; row < BOARD_HEIGHT; row++){
    board[row] = [];
    for(let col = 0 ; col < BOARD_WIDTH; col++){
        board[row][col] = 0;
    }
}
/*function startGame() {
    
    gameOver = false;
    console.log("Game started!");
}*/

//Formas dos Blocos do Tetris
const tetrominoes = [
    {
        shape : [
            [1,1],
            [1,1]
        ],
        color : "#ffd800",
    },
    {
        shape : [
            [0,2,0],
            [2,2,2]
        ],
        color : "#7925dd",
    },
    {
        shape : [ 
            [0,3,3],
            [3,3,0]
        ],
        color : "orange",
    },
    {
        shape : [
            [4,4,0],
            [0,4,4]
        ],
        color : "red",
    },
    {
        shape : [
            [5,0,0],
            [5,5,5]
        ],
        color : "green",
    },
    {
        shape : [
            [0,0,6],
            [6,6,6]
        ],
        color : "#ff6400",
    },
    {
        shape : [[7,7,7,7]],
        color : "#00b5ff",
    },
];

//Função para Randomizar a forma do Bloco
function randomTetromino(){
   
    const index = Math.floor(Math.random() * tetrominoes.length);
    const tetromino = tetrominoes[index];
    return {
        shape : tetromino.shape,
        color : tetromino.color,
        row : 0,
        col : Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length +1)),
    };
}

let currentTetromino = randomTetromino();
//let currentGhostTetromino;

//Função Desenhar o Bloco
function drawTetromino() {
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    const row = currentTetromino.row;
    const col = currentTetromino.col;

    for(let r = 0; r < shape.length; r++){
        for(let c = 0; c < shape[r].length; c++){
            if(shape[r][c]){
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.backgroundColor = color;
                block.style.top = (row + r) * 24 + 'px';
                block.style.left = (col + c) * 24 + 'px';
                block.setAttribute('id',`block-${row + r}-${col + c}` );
                document.getElementById('game_board').appendChild(block);
            }
        }
    }    
}
//Atualiza o Score e Speed do jogo
function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}
//Função GAME-OVER
function checkGameOver() {
    // Verifica se a primeira linha do tabuleiro contém algum bloco preenchido
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (board[0][col] !== 0) {
        return true; // Game Over
      }
    }
    
    return false; // Jogo continua
}

//Função Apaga o Bloco anterior
function eraseTetromino(){
    for(let i =  0; i < currentTetromino.shape.length; i++){
        for(let j = 0; j < currentTetromino.shape[i].length; j++){
            if(currentTetromino.shape[i][j] !== 0 ){
                let row = currentTetromino.row + i;
                let col = currentTetromino.col + j;
                let block = document.getElementById(`block-${row}-${col}`);

                if(block){
                    document.getElementById("game_board").removeChild(block);
                }
            }
        }
    }
}
//Função de travar o moviento e rotação do Bloco
//Movimento
function canTetrominoMove(rowOffset, colOffset){
    for(let i = 0 ; i < currentTetromino.shape.length; i++){
        for(let j = 0 ; j < currentTetromino.shape[i].length ; j++){
            if(currentTetromino.shape[i][j] !== 0 ){
                let row = currentTetromino.row + i + rowOffset;
                let col = currentTetromino.col + j + colOffset;
                
                if(row >= BOARD_HEIGHT || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0 )){
                    return false;
                }
            }
        }
    }
    return true;
}
//Rotação
function canTetrominoRotate (){
    for(let i = 0 ; i < rotatedShape.length; i++){
        for(let j = 0 ; j < rotatedShape[i].length; j++){
            if(rotatedShape[i][j] !== 0){
                let row = currentTetromino.row +i;
                let col = currentTetromino.col +j;

                if(row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0 )){
                    return false;
                }
            }
        }
    }
    return true;
}
//Travamento do Bloco
function lockTetromino(){
    for(let i = 0 ; i < currentTetromino.shape.length ; i++){
        for(let j = 0 ; j < currentTetromino.shape[i].length ; j ++){
            if(currentTetromino.shape[i][j] !== 0 ){
                let row = currentTetromino.row + i;
                let col = currentTetromino.col + j;
                board[row][col] = currentTetromino.color; 
            }
        }
    }
    clearLine()
    checkGameOver()
      
    currentTetromino = randomTetromino();
}
//Funcao de apagar linha completada
function clearLine() {
    let rowCleared = 0;
  
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      let rowFilled = true;
  
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] === 0) {
          rowFilled = false;
          break;
        }
      }
  
      if (rowFilled) {
        if (breakSound) {
          breakSound.muted = false;
          breakSound.play();
        }
        rowCleared++;
  
        for (let yy = y; yy > 0; yy--) {
          board[yy] = [...board[yy - 1]];
        }
        board[0] = new Array(BOARD_WIDTH).fill(0);
  
        renderBoard();
      }
    }
}

//Função para Atulaizar o Tabuleiro
function renderBoard() {
    const gameBoardElement = document.getElementById("game_board");
    gameBoardElement.innerHTML = "";
  
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (board[row][col]) {
          const block = document.createElement("div");
          block.classList.add("block");
          block.style.backgroundColor = board[row][col];
          block.style.top = row * 24 + "px";
          block.style.left = col * 24 + "px";
          block.setAttribute("id", `block-${row}-${col}`);
          gameBoardElement.appendChild(block);
        }
      }
    }
    score += 10;
    updateScore();
}

function rotateTetromino(){
    rotatedShape = [];
    for(let i = 0; i < currentTetromino.shape[0].length; i++){
        let row = [];
        for(let j = currentTetromino.shape.length -1; j >= 0; j--){
            row.push(currentTetromino.shape[j][i]);
        }
        rotatedShape.push(row);
    }
    if(canTetrominoRotate()){
        eraseTetromino()
        currentTetromino.shape = rotatedShape;
        drawTetromino();
    }  
}


function moveTetromino(direction){
    let row = currentTetromino.row;
    let col = currentTetromino.col;

    if(direction === "left" ){
        if(canTetrominoMove(0,-1)){
            eraseTetromino();
            col -= 1;
            currentTetromino.col = col;
            currentTetromino.row = row;
            drawTetromino();
        }
    }else if(direction === "right" ){
        if(canTetrominoMove(0,1)){
        eraseTetromino();
        col += 1;
        currentTetromino.col = col;
        currentTetromino.row = row;
        drawTetromino();
        }
    }else {
        if(canTetrominoMove(1,0)){
            eraseTetromino();
            row++;
            currentTetromino.col = col;
            currentTetromino.row = row;
            drawTetromino();
        }else{
            lockTetromino();
        }
    }
}

drawTetromino();
setInterval(moveTetromino, speed)


function dropTetromino(){
    let row = currentTetromino.row;
    let col = currentTetromino.col;

    

    drop.muted = false;

    drop.play();

    while(canTetrominoMove(1,0)){
        eraseTetromino();
        row++;
        currentTetromino.col = col;
        currentTetromino.row = row;
        drawTetromino();
    }
    lockTetromino();
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event){
    switch(event.keyCode){
        case 37 : //Seta da esquerda
            moveTetromino('left');
        break;
        case 39 : //Seta da direita
            moveTetromino('right');
        break;
        case 40 : //Seta pra baixo
            moveTetromino('down');
        break;
        case 38 : //Seta pra cima gira o bloco
           rotateTetromino();
        break;
        case 32 : //Barra de espaço dropa o bloco
           dropTetromino();
        break;
    }
}