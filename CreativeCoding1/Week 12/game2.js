var characterX = 100;
var characterY = 100;
var w = 87; 
var s = 83;
var a = 65;
var d = 68;


var obstacle1X = 30;
var obstacle1Y = 50;
var obstacle1XSpeed;
var obstacle1YSpeed;
var obstacle1Size = 30;
var obstacle1Color;

var obstacle2X = 500;
var obstacle2Y = 400;
var obstacle2XSpeed;
var obstacle2YSpeed;
var obstacle2Size = 50;
var obstacle2Color;

var mouseShapeX;
var mouseShapeY;
var mouseShapeSize = 25;

function setup() {
    createCanvas(700, 700);
    createPlayer(200, 350);
    createObstacles();
}

function createPlayer(x, y) {
    characterX = x;
    characterY = y;
}

function movePlayer() {
    if(keyIsDown(w)) characterY -= 5;   
    if(keyIsDown(s)) characterY += 5;   
    if(keyIsDown(a)) characterX -= 5;   
    if(keyIsDown(d)) characterX += 5;   
}

function drawPlayer() {
    fill(23, 40, 123);
    rect(characterX, characterY, 30, 30);
}

function drawMouseShape() {
    fill(170, 0, 93);
    circle(mouseShapeX, mouseShapeY, mouseShapeSize);
}

function mouseClicked() {
    mouseShapeX = mouseX;
    mouseShapeY = mouseY;
}

function createObstacles() {
    obstacle1XSpeed = (Math.floor(Math.random() * 5) + 1);
    obstacle1YSpeed = (Math.floor(Math.random() * 3) + 1);
    obstacle1Color = color(148, 48, 58);
    
    obstacle2XSpeed = (Math.floor(Math.random() * 4) + 1) * -1;
    obstacle2YSpeed = (Math.floor(Math.random() * 5) + 1);
    obstacle2Color = color(200, 100, 30);
}

function moveObstacle1() {
    obstacle1X += obstacle1XSpeed;
    obstacle1Y += obstacle1YSpeed;
    
    if(obstacle1X > width) obstacle1X = 0;
    if(obstacle1X < 0) obstacle1X = width;
    if(obstacle1Y > height) obstacle1Y = 0;
    if(obstacle1Y < 0) obstacle1Y = height;
    
    fill(obstacle1Color);
    triangle(obstacle1X, obstacle1Y, 
             obstacle1X+obstacle1Size, obstacle1Y, 
             obstacle1X+obstacle1Size/2, obstacle1Y-obstacle1Size);
}

function moveObstacle2() {
    obstacle2X += obstacle2XSpeed;
    obstacle2Y += obstacle2YSpeed;
    
    if(obstacle2X > width) obstacle2X = 0;
    if(obstacle2X < 0) obstacle2X = width;
    if(obstacle2Y > height) obstacle2Y = 0;
    if(obstacle2Y < 0) obstacle2Y = height;
    
    fill(obstacle2Color);
    rect(obstacle2X, obstacle2Y, obstacle2Size, obstacle2Size);
}

function drawBorders() {
    fill(0)
    rect(0,0,699,1);
    rect(0,0,1,699);
    rect(0,699-1,699, 1);
    rect(699-1,0,1,699-1);

}
function drawExit() {
    fill(0);
    const exitWidth = width * 0.1;
    const exitHeight = height * 0.1;
    
    rect(0, height*0.45, exitWidth, exitHeight);
    
    fill(0);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("Exit", exitWidth/2, height*0.45 - 15);
}

function displayWinMessage() {
    fill(0);
    stroke(5);
    textSize(26);
    textAlign(CENTER, CENTER);
    text("Good Job! You Win!", width / 2, height / 2);
}

function checkWinCondition() {
    return (characterX < width * 0.1 &&
            characterY > height * 0.45 && 
            characterY + 30 < height * 0.55);
}

function draw() {

    background(48, 148, 91);
    
    drawBorders();
    drawExit();
    drawPlayer();
    movePlayer();
    moveObstacle1();
    moveObstacle2();
    drawMouseShape();
    
    if (checkWinCondition()) {
        displayWinMessage();
    }
}