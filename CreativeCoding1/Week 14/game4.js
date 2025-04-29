var characterX = 100;
var characterY = 100;
var w = 87; 
var s = 83;
var a = 65;
var d = 68;

var mouseObstacles = [];
var mouseObstacleSize = 25;

var customShapes = [];

function setup() {
    createCanvas(700, 700);
    createPlayer(200, 350);
    
    customShapes.push(new CustomShape(100, 100, 40, 60, color(255, 0, 0)));
    customShapes.push(new CustomShape(400, 300, 80, 80, color(0, 255, 0)));
    customShapes.push(new CustomShape(500, 150, 60, 100, color(0, 0, 255)));
}

class CustomShape {
    constructor(x, y, width, height, col) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = col;
    }
    
    display() {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
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

function drawMouseObstacles() {
    fill(170, 0, 93);
    noStroke();
    for (let i = 0; i < mouseObstacles.length; i++) {
        let obs = mouseObstacles[i];
        circle(obs.x, obs.y, mouseObstacleSize);
    }
}

function mouseClicked() {
    mouseObstacles.push({
        x: mouseX,
        y: mouseY
    });
}

function drawBorders() {
    fill(0);
    rect(0, 0, width, 1);
    rect(0, 0, 1, height);
    rect(0, height-1, width, 1);
    rect(width-1, 0, 1, height);
}

function drawExit() {
    fill(0);
    const exitWidth = width * 0.1;
    const exitHeight = height * 0.1;
    
    rect(0, height*0.45, exitWidth, exitHeight);
    
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Exit", exitWidth/2, height*0.45 + exitHeight/2);
}

function displayWinMessage() {
    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(32);
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
    drawMouseObstacles();
    
    for (let i = 0; i < customShapes.length; i++) {
        customShapes[i].display();
    }
    
    if (checkWinCondition()) {
        displayWinMessage();
    }
}