Final Project - Nathan Crittenden

Ableton to Javascript Visualizer

    Main Goals
    1.Create a visualiser through p5.js to visually represent musical and production changes.
        i. Parameters that usually effect shapes to be mapped to midi tracks.
            Ex. The color, opacity, or x and y position of a shape will be decided by midi information coming Ableton instruments themselves.
    -Create limitations of the visualizer to keep the animations smooth and visually pleasing.

    Implementation/Project Submission
         1.If the visualiser succeeds in live parameter manippulation, the actual subission of this project will be a screen recorded video of the visualiser working through midi (with sound to demonstrate).  Most likely because of the local connections, this visualiser will not be universal.

    Inspiration/Related Works
        -I've been interested in learning visual coding languages such as TouchDesigner to be able to do this very thing.  I assume learning how to do this in a typing based code language such as javascript will make working with visual modules in TouchDesigner much easier.
        -Artists such as Radiohead, Flying Lotus, and Jon Hopkins have all inspired me to want to build something such as this.  They use live visualizers during performances and music videos.

    New Technologies/Required Connections
        1.loopMIDI (https://www.tobias-erichsen.de/software/loopmidi.html)
        -loopMIDI is a software made by Tobias-Erichsen to creat virtual loopback MIDI ports to interconnect applications on Windows to use MIDI inputs and outputs.
            i.Using virtualMIDI driver to create ports

        2.WebMIDI (https://webmidijs.org/docs/)
         -WebMIDI is a .js file that allows web pages to interact with MIDI inputs.  It is a free product based through cloudflare.
    -There are a few youtube tutorials and codes on the pages listed I plan to learn to be able to make this visualizer possible.

    Potential Problem/Solution
        - There may be connectivity issues, unfixabled parameter issues, or other problems to arise.  If this happens, I will manually put in different parameters from an ableton live-set to make a "music video" visualizer. Hopefully it will not come to this option, but if so the code would be universal in the sense it is made for one single musical track.

    Work Plan
        4/29
            -Initially Connect Ableton with x, y, color, and opacity parameters as a test run with a simple shape.
        4/30
            -Start building a background in color and timeline for dynamic changes in visualizer.
        5/1
            -Finish background and timeline troubleshooting, move on to simple shapes and their automation.  Test out parameter limitations.
        5/2
            -Finish Parameter limitations.
        5/3
            -Code Indiviudal shape automation.
        5/4
            -Rough Draft of visualizer completion.  Edit code to be more visually pleasing.
        5/5
            -Any last minute troubleshooting before submission.

    4/27 - 4/28 1.5 hours
        - Initial Background research completed.  Found software and required code to commence.
        - Initial index and sketch.js page to set up functions.
        - loopMIDI downloaded.

    4/29 - 4/30 - 3 hours
        -Inital configuration of established of just a circle and being able to change the x and y parameters of said circle using a midi instrument. This was far more complicated than expected.  It is leaving me to think that mapping a whole song with 10-20 tracks may be a bit too optimistic of an approach.
            -index.html :
<html>
<head>
  <title>Ableton to p5.js Visualizer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
  <script src="sketch.js"></script>
</head>
<body>
  <div id="midi-status">Loading...</div>

</body>
</html>
            -sketch.js
let circleX = 250;
let circleY = 250;
let midiAccess;
let output;
let midiStatus = "Initializing...";
const MIDI_CHANNEL = 0; // MIDI channel 1 (0-based)

function setup() {
  createCanvas(1000, 1000);
  colorMode(RGB, 255);
  textAlign(CENTER, CENTER);
  
  // Create GUI sliders for testing
  createP("Circle X Control:");
  let xSlider = createSlider(0, width, circleX);
  xSlider.input(() => {
    circleX = xSlider.value();
    sendMIDI(1, map(circleX, 0, width, 0, 127)); // CC1 for X
  });
  
  createP("Circle Y Control:");
  let ySlider = createSlider(0, height, circleY);
  ySlider.input(() => {
    circleY = ySlider.value();
    sendMIDI(2, map(circleY, 0, height, 0, 127)); // CC2 for Y
  });
  
  // Initialize MIDI
  initMIDI();
}

function draw() {
  background(30);
  fill(255, 100, 100);
  ellipse(circleX, circleY, 50);
  
  // Draw status
  fill(255);
  textSize(16);
  text(midiStatus, width/2, 30);
}

function initMIDI() {
  midiStatus = "Requesting MIDI access...";
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false })
      .then(
        (midi) => {
          midiAccess = midi;
          setupMIDIInputs();
          setupMIDIOutputs();
          midiStatus = "MIDI connected!";
          console.log("MIDI successfully connected");
        },
        (err) => {
          midiStatus = "MIDI access denied";
          console.error("MIDI access error:", err);
        }
      );
  } else {
    midiStatus = "WebMIDI not supported";
    console.warn("WebMIDI not supported in this browser");
  }
}

function setupMIDIInputs() {
  const inputs = midiAccess.inputs.values();
  let hasInputs = false;
  
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    // Connect to Ableton input
    if (input.value.name.includes("Ableton")) {
      input.value.onmidimessage = handleMIDI;
      console.log("Connected to MIDI input:", input.value.name);
      hasInputs = true;
    }
  }
  
  if (!hasInputs) {
    midiStatus = "No MIDI inputs found";
    console.warn("No MIDI input devices found");
  }
  
  midiAccess.onstatechange = (event) => {
    console.log("MIDI device state changed:", event.port.name, event.port.state);
    if (event.port.state === "connected" && event.port.type === "input") {
      setupMIDIInputs();
    }
  };
}

function setupMIDIOutputs() {
  midiAccess.outputs.forEach(outputPort => {
    // Connect to VS Code output
    if (outputPort.name.includes("VS Code")) {
      output = outputPort;
      console.log("Connected to MIDI output:", output.name);
    }
  });
}

function handleMIDI(message) {
  const [command, control, value] = message.data;
  
  if ((command >> 4) === 0xB && (command & 0xF) === MIDI_CHANNEL) {
    switch(control) {
      case 1: // CC1 for X position
        circleX = map(value, 0, 127, 0, width);
        break;
      case 2: // CC2 for Y position
        circleY = map(value, 0, 127, 0, height);
        break;
    }
  }
}

function sendMIDI(control, value) {
  if (output) {
    // Send Control Change message (0xB0 = CC on channel 1)
    output.send([0xB0 + MIDI_CHANNEL, control, Math.round(value)]);
    console.log(`Sent MIDI: CC${control} = ${value}`);
  } else {
    console.warn("No MIDI output connected");
  }
}
    5/1 - 4 hours
        -Keyboard mapping established creating shapes in a spiral every time a note on a keyboard is pressed with changing colors each time.  Circle parameters are maintianed.
            -index2.html created
            -setupsketch.js created
      5/1 - 2 hours
      -MIDI Keyboard setup video recorded, detailing some of the basic aspects of the spiral note player.
      - Nathan Visualiser Backplate made in photoshop
      -Initial cloud move function, rain function and day/night functions made in P5 online previewer
            // Array to hold clouds
    let clouds = [];
    let globalSpeed = 1.0; // Master speed control
    let isNightMode = false; // Day/Night toggle state
    let toggleSwitch = { x: 30, y: 30, width: 60, height: 30, radius: 15 };
    
    // Rain variables
    let rainSpeed = 5; // Base speed for rain
    let rainDrops = []; // Array to store rain drops
    const rainCount = 200; // Number of rain drops

    function setup() {
      createCanvas(800, 600);
      
      // Create cloud objects
      clouds = [
        {x: 200, y: 150, scale: 1.0, relativeSpeed: 0.8, dayColor: [255, 255, 255], nightColor: [150, 150, 150]},
        {x: 400, y: 100, scale: 1.2, relativeSpeed: 1.0, dayColor: [255, 255, 255], nightColor: [140, 140, 140]},
        {x: 600, y: 180, scale: 0.8, relativeSpeed: 0.4, dayColor: [255, 255, 255], nightColor: [160, 160, 160]},
        {x: 50, y: 200, scale: 0.5, relativeSpeed: 0.6, dayColor: [255, 255, 255], nightColor: [170, 170, 170]}
      ];
      
      // Initialize rain drops
      for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
          x: random(width),
          y: random(-height, 0),
          length: random(10, 30),
          speed: random(5, 10)
        });
      }
      
      // Add mouse wheel control for cloud speed
      window.addEventListener('wheel', function(e) {
        if (!mouseIsPressed) {
          globalSpeed += e.deltaY * -0.01;
          globalSpeed = constrain(globalSpeed, 0, 3);
          e.preventDefault();
        }
      }, { passive: false });
    }
    
    function draw() {
      // Set background based on mode
      if (isNightMode) {
        background(25, 25, 112); // Dark blue for night
      } else {
        background(135, 206, 235); // Sky blue for day
      }
      
      // Draw and update rain
      drawRain();
      
      // Draw the toggle switch
      drawToggleSwitch();
      
      // Update and draw all clouds
      for (let cloud of clouds) {
        updateCloud(cloud);
        drawCloud(cloud);
      }
      
      // Display controls
      fill(isNightMode ? 200 : 0);
      noStroke();
      textSize(14);
      text("Cloud Speed: " + globalSpeed.toFixed(1), 120, 45);
      text("Rain Speed: " + rainSpeed.toFixed(1), 120, 65);
      text("(Hold SHIFT + scroll for rain speed)", 120, 85);
      text("(Scroll normally for cloud speed)", 120, 105);
    }
    
    function drawRain() {
      // Set rain color based on mode (lighter in day, slightly darker at night)
      let rainColor = isNightMode ? color(150, 150, 255, 150) : color(200, 230, 255, 180);
      stroke(rainColor);
      strokeWeight(1);
      
      for (let drop of rainDrops) {
        // Draw rain drop (vertical line)
        line(drop.x, drop.y, drop.x, drop.y + drop.length);
        
        // Update position based on rain speed
        drop.y += drop.speed * (rainSpeed / 5);
        
        // Reset position when drop goes off screen
        if (drop.y > height) {
          drop.y = random(-100, 0);
          drop.x = random(width);
        }
      }
    }
    
    function mousePressed() {
      // Check if toggle switch was clicked
      if (mouseX > toggleSwitch.x && mouseX < toggleSwitch.x + toggleSwitch.width &&
          mouseY > toggleSwitch.y && mouseY < toggleSwitch.y + toggleSwitch.height) {
        isNightMode = !isNightMode;
      }
    }
    
    function keyPressed() {
      // Use shift + mouse wheel to control rain speed
      if (keyCode === SHIFT) {
        window.addEventListener('wheel', function(e) {
          rainSpeed += e.deltaY * -0.1;
          rainSpeed = constrain(rainSpeed, 0.5, 15);
          e.preventDefault();
        }, { passive: false });
      }
    }
    
    function keyReleased() {
      if (keyCode === SHIFT) {
        window.addEventListener('wheel', function(e) {
          globalSpeed += e.deltaY * -0.01;
          globalSpeed = constrain(globalSpeed, 0, 3);
          e.preventDefault();
        }, { passive: false });
      }
    }
    
    function drawToggleSwitch() {
      // Switch background
      fill(isNightMode ? color(70, 70, 70) : color(200, 200, 200));
      rect(toggleSwitch.x, toggleSwitch.y, toggleSwitch.width, toggleSwitch.height, toggleSwitch.radius);
      
      // Switch handle
      let handleX = isNightMode ? toggleSwitch.x + toggleSwitch.width - toggleSwitch.radius : toggleSwitch.x + toggleSwitch.radius;
      fill(255);
      circle(handleX, toggleSwitch.y + toggleSwitch.height/2, toggleSwitch.radius * 1.8);
      
      // Day/Night labels
      textSize(12);
      fill(isNightMode ? 150 : 0);
      text("DAY", toggleSwitch.x + 5, toggleSwitch.y + 20);
      fill(isNightMode ? 255 : 150);
      text("NIGHT", toggleSwitch.x + toggleSwitch.width - 35, toggleSwitch.y + 20);
    }
    
    function updateCloud(cloud) {
      cloud.x += cloud.relativeSpeed * globalSpeed;
      
      if (cloud.x > width + 100) {
        cloud.x = -100;
      }
      if (cloud.x < -100) {
        cloud.x = width + 100;
      }
    }
    
    function drawCloud(cloud) {
      push();
      translate(cloud.x, cloud.y);
      scale(cloud.scale);
      
      fill(isNightMode ? cloud.nightColor : cloud.dayColor);
      noStroke();
      
      ellipse(0, 0, 100, 60);
      ellipse(40, -10, 80, 60);
      ellipse(-40, -10, 80, 60);
      ellipse(20, 20, 70, 50);
      ellipse(-20, 20, 70, 50);
      ellipse(60, 10, 60, 40);
      ellipse(-60, 10, 60, 40);
      
      pop();
    }

      5/2 - 5/3 4 hours
        -Final project created and mostly finished.  Created Window Notes, converted clouds, day/night, and rain to midi handling.
      5/5 2 hours
        -Final video recorded.  Editted both videos.  Because of the nature of this sketch, the only users can be those with MIDI capabilities that have to map their automation knobs to CC 1, CC 2 and CC 3.  Because of this, I created both videos to show the final product.  Excuse my piano playing, should've practiced this chord progression much more before recording.
          Parameters Mapped
          CC 1 - is linked to both the Cloud Speed and Auto filter of the both the drums and sample.
          CC 2 - linked to both Rain Speed and Rain Sample Sound
          CC 3 - Day/Night not linked to any audio effects
          C2 - C6 : MIDI Keyboard inputs that are linked to randomized spots behind the building image I created in photoshop.
    I will most definitely be using this base more.  I think I need to polish my video editing skills and make an actual song for this purpose, but this was by far the most fulfilling work in VS Code I have done yet.  The hardest part was probably trying to manipulate the image to render in javascript.  Multiple times I tried to load it in the actual finalsketch.js code, but I found that putting it in the html file was much smoother.  The Z index was also a little tricky for this project.