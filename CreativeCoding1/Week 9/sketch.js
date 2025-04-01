function setup()
{
    createCanvas(1000, 800);
}

function draw()
{
    background(173,216,230);
    textSize(50)
    text("Hello!", 250,40);
  
    //right leg
    fill(210, 180, 140);
    rect(420,540,50,75);
   
    //left leg
    fill(210, 180, 140)
    rect(490,540,50,75);
  
    // body
    fill(136, 48, 0);
    rect(430,400,100,150);
  
    // head
    fill(210, 180, 140);
    circle(500,250,400);
   
    // nose
    strokeWeight(10);
    fill(106,136,167);
    point(492,240);
    point(512,240);
    
    // mouth
    fill(106,136,167);
    ellipse(550, 180, 30, 45);
    ellipse(450, 180, 30, 45);
    
    //Iris
    fill(0);
    point(452, 180);
    point(552, 180);

    // mouth
    fill ((255, 0, 0));
    arc(500,350,175,150, 0, PI);
  
    // arms
    line(430,450,370,450);
    line(600,450,500,450);
  
    //hair
    fill(251, 246, 217);
    arc(410,49,200,200, 0, -3.14);
    arc(600,49,200,200, 0, -3.14);
    
    // decoration
    fill(10, 24, 120);
    rect(435,500,90,5);
    
    fill(0, 64, 0);
    textSize(22);
    text("Nathan",600,600 );
}