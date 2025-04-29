var characterX = 100;
var characterY = 100;
var w = 87; 
var s = 83;
var a = 65;
var d = 68;

var mouseObstacles = [];
var mouseObstacleSize = 25;

var obstacles = [];
var numObstacles = 5;

function setup() {
    createCanvas(700, 700);
    createPlayer(200, 350);
    createMovingObstacles();
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

function createMovingObstacles() {
    for (let i = 0; i < numObstacles; i++) {
        let size = random(20, 60);
        let obstacle = {
            x: random(width),
            y: random(height),
            size: size,
            xSpeed: random(-3, 3),
            ySpeed: random(-3, 3),
            color: color(random(255), random(255), random(255)),
            shape: floor(random(3))
        };
        if (abs(obstacle.xSpeed) < 1) obstacle.xSpeed = 1;
        if (abs(obstacle.ySpeed) < 1) obstacle.ySpeed = 1;
        obstacles.push(obstacle);
    }
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        
        o.x += o.xSpeed;
        o.y += o.ySpeed;
        
        if (o.x > width + o.size) o.x = -o.size;
        if (o.x < -o.size) o.x = width + o.size;
        if (o.y > height + o.size) o.y = -o.size;
        if (o.y < -o.size) o.y = height + o.size;
        
        fill(o.color);
        noStroke();
        
        if (o.shape === 0) {
            rect(o.x, o.y, o.size, o.size);
        } else if (o.shape === 1) {
            circle(o.x, o.y, o.size);
        } else {
            triangle(
                o.x, o.y - o.size/2,
                o.x - o.size/2, o.y + o.size/2,
                o.x + o.size/2, o.y + o.size/2
            );
        }
    }
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
    moveObstacles();
    drawMouseObstacles();
    
    if (checkWinCondition()) {
        displayWinMessage();
    }
}