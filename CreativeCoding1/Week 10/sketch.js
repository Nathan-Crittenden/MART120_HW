var movementX = 15;
var movementY = 10;
var x = 0;
var y = 0;
var hairSpeed1, hairSpeed2, legsSpeed, mouthSpeed;
var textSizeCounter = 0;
var textGrowing = true;
var currentTextSize = 50;

function setup() {
    createCanvas(1000, 800);
    x = 410;
    y = 350;
    
    hairSpeed1 = floor(random() * 2) + 1;
    hairSpeed2 = floor(random() * 2) + 1;
    legsSpeed = floor(random() * 2) + 1;
    mouthSpeed = floor(random() * 1) + 1;
}

function draw() {
    background(173, 216, 230);
    
    // Growing text size
    if (textGrowing) {
        currentTextSize += 1;
        if (currentTextSize >= 100) textGrowing = false;
    } else {
        currentTextSize -= 1;
        if (currentTextSize <= 50) textGrowing = true;
    }
    textSize(currentTextSize);
    text("Hello!", 50, 70);

    x += movementX;
    y += movementY;

    if (x >= 600 || x <= 200) {
        movementX *= -1;
    }
    
    if (y >= 400 || y <= 300) {
        movementY *= -1;
    }

    // Legs movement
    var legsX = sin(frameCount * 0.05 * legsSpeed) * 30;
    var legsY = cos(frameCount * 0.05 * legsSpeed) * 30;
  
    //right leg
    fill(210, 180, 140);
    rect(420 + legsX, 540 + legsY, 50, 75);
   
    // left leg
    fill(210, 180, 140);
    rect(490 + legsX, 540 + legsY, 50, 75);
  
    // body
    fill(136, 48, 0);
    rect(430, 400, 100, 150);
  
    // head
    fill(210, 180, 140);
    circle(500, 250, 400);
   
    // nose
    strokeWeight(10);
    fill(106, 136, 167);
    point(492, 240);
    point(512, 240);
    
    // eyes
    fill(106, 136, 167);
    ellipse(550, 180, 30, 45);
    ellipse(450, 180, 30, 45);
    
    // Iris
    fill(0);
    point(452, 180);
    point(552, 180);

    // mouth (moves on y-axis)
    fill(0, 0, 0);
    arc(500, y, 175, 150, 0, PI);
  
    // arms
    line(430, 450, 370, 450);
    line(600, 450, 500, 450);
  
    // hair arcs (move on x-axis at different speeds)
    fill(251, 246, 217);
    arc(x * hairSpeed1/5 + 310, 49, 200, 200, 0, -PI);
    arc(x * hairSpeed2/5 + 500, 49, 200, 200, 0, -PI);
    
    // hair triangle (moves on y-axis)
    triangle(470, 48 + (y-350)/2, 530, 48 + (y-350)/2, 500, 20 + (y-350)/2);
    
    // decoration
    fill(10, 24, 120);
    rect(435, 500, 90, 5);
    
    fill(0, 64, 0);
    textSize(22);
    text("Nathan", 600, 600);
}