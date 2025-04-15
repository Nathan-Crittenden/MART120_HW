var characterX = 100;
var characterY = 100;
var w = 87; 
var s = 83;
var a = 65;
var d = 68;

// x and y for a shape
var shapeX = 30;
var shapeY = 50;
var shapeXSpeed;
var shapeYSpeed;

// create a shape when the mouse is clicked
var mouseShapeX;
var mouseShapeY;

function setup()
{
    createCanvas(700, 700);
    shapeXSpeed = (Math.floor(Math.random() * 5) + 1) * 2;
    shapeYSpeed = Math.floor(Math.random() * 3) + 1;
    createCharacter(200,350);
}

function createCharacter(x,y)
{
    characterX = x;
    characterY = y;
}

function drawCharacter()
{
    fill(23,40,123);
    rect(characterX, characterY, 30, 30);
}

function createExit(thickness) {
  fill(0);

  rect(0, height*0.45, width*0.1, thickness);

  rect(0, height*0.55, width*0.1, thickness);
}
function draw()
{
    background(48, 148, 91);
    stroke(0);
    fill(0);
    
    createExit(5);

    const textY = height * 0.5;
    const textX = width * 0.15;
    textSize(10);
    textAlign(CENTER, CENTER);
    text("Done?", textX, textY)

    drawCharacter();
    characterMovement();

    // Enemy triangle
    fill(148, 48, 58);
    triangle(shapeX, shapeY, shapeX+30, shapeY, shapeX+15, shapeY-30);

    shapeX += shapeXSpeed;
    shapeY += shapeYSpeed;
    
    if(shapeX > width) shapeX = 0;
    if(shapeX < 0) shapeX = width;
    if(shapeY > height) shapeY = 0;
    if(shapeY < 0) shapeY = height;

    // Win condition
    if (characterX < 0 &&
      characterY > height * 0.45 && 
      characterY + 30 < height * 0.55)
  {
      fill(0);
      stroke(5);
      textSize(26);
      textAlign(CENTER, CENTER);
      text("Good Job! You Win!", width / 2, height / 2);
   }

    // Mouse click shape
    fill(170,0,93);
    circle(mouseShapeX, mouseShapeY, 25);
}

function characterMovement()
{
    if(keyIsDown(w)) characterY -= 10;   
    if(keyIsDown(s)) characterY += 10;   
    if(keyIsDown(a)) characterX -= 10;   
    if(keyIsDown(d)) characterX += 10;   
}

function mouseClicked()
{
    mouseShapeX = mouseX;
    mouseShapeY = mouseY;
}