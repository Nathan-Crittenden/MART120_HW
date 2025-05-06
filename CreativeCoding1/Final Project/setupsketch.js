let circleX = 500;
let circleY = 500;
let midiAccess;
let output;
let midiStatus = "Initializing...";
const MIDI_CHANNEL = 0; // MIDI channel 1 (0-based)

// Keyboard visualization
const NOTE_RANGE = { low: 36, high: 84 }; // C2 to C6
let activeNotes = new Map(); // Stores active notes and their properties

function setup() {
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  noStroke();
  
  // Setup sliders
  document.getElementById('xSlider').addEventListener('input', (e) => {
    circleX = parseInt(e.target.value);
    sendMIDI(1, map(circleX, 0, width, 0, 127));
  });
  
  document.getElementById('ySlider').addEventListener('input', (e) => {
    circleY = parseInt(e.target.value);
    sendMIDI(2, map(circleY, 0, height, 0, 127));
  });
  
  initMIDI();
}

function draw() {
  background(30);
  
  // Draw all active note rectangles in spiral
  drawSpiralNotes();
  
  // Draw control circle
  fill(0, 100, 100);
  ellipse(circleX, circleY, 50);
  
  fill(0, 0, 100);
  textSize(16);
  text(midiStatus, width/2, 30);
}

function drawSpiralNotes() {
  const centerX = width/2;
  const centerY = height/2;
  const totalNotes = NOTE_RANGE.high - NOTE_RANGE.low + 1;
  const maxRadius = width/2 * 0.95;
  const spiralTurns = 5;

  activeNotes.forEach((noteData, note) => {
    const spiralPos = (note - NOTE_RANGE.low) / totalNotes;
    
    // Spiral positioning (starts at top with -HALF_PI offset)
    const angle = spiralPos * TWO_PI * spiralTurns - HALF_PI;
    const radius = maxRadius * spiralPos;
    
    // Calculate position
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    
    const size = map(spiralPos, 0, 1, 30, 140);
    const cornerRadius = size * 0.15;
    
    // Draw rectangle with spiral-aligned rotation
    push();
    translate(x, y);
    rotate(angle + PI/4);
    fill(noteData.color);
    rectMode(CENTER);
    rect(0, 0, size, size, cornerRadius);
    pop();
  });
}

function initMIDI() {
  midiStatus = "Requesting MIDI access...";
  document.getElementById('midi-status').textContent = midiStatus;
  
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false })
      .then(
        (midi) => {
          midiAccess = midi;
          setupMIDIInputs();
          setupMIDIOutputs();
          midiStatus = "MIDI connected!";
          document.getElementById('midi-status').textContent = midiStatus;
          console.log("MIDI successfully connected");
        },
        (err) => {
          midiStatus = "MIDI access denied: " + err.message;
          document.getElementById('midi-status').textContent = midiStatus;
          console.error("MIDI access error:", err);
        }
      );
  } else {
    midiStatus = "WebMIDI not supported";
    document.getElementById('midi-status').textContent = midiStatus;
    console.warn("WebMIDI not supported in this browser");
  }
}

function setupMIDIInputs() {
  const inputs = midiAccess.inputs.values();
  let hasInputs = false;
  
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    if (input.value.name.includes("Ableton")) {
      input.value.onmidimessage = handleMIDIMessage;
      console.log("Connected to MIDI input:", input.value.name);
      hasInputs = true;
    }
  }
  
  if (!hasInputs) {
    midiStatus = "No MIDI inputs found";
    document.getElementById('midi-status').textContent = midiStatus;
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
    if (outputPort.name.includes("VS Code")) {
      output = outputPort;
      console.log("Connected to MIDI output:", output.name);
    }
  });
}

function handleMIDIMessage(message) {
  const [command, note, value] = message.data;
  const noteOn = (command >> 4) === 0x9 && value > 0;
  const noteOff = (command >> 4) === 0x8 || ((command >> 4) === 0x9 && value === 0);
  const controlChange = (command >> 4) === 0xB;
  
  // Handle keyboard notes (C2-C6)
  if (note >= NOTE_RANGE.low && note <= NOTE_RANGE.high) {
    if (noteOn) {
      // Create color based on note pitch and velocity
      const hue = map(note, NOTE_RANGE.low, NOTE_RANGE.high, 0, 360);
      const saturation = map(value, 0, 127, 70, 100);
      const brightness = map(value, 0, 127, 80, 100);
      
      activeNotes.set(note, {
        color: color(hue, saturation, brightness),
        velocity: value
      });
    } else if (noteOff) {
      activeNotes.delete(note);
    }
  }
  
  // Handle circle control messages
  if (controlChange && (command & 0xF) === MIDI_CHANNEL) {
    switch(note) {
      case 1: // CC1 for X
        circleX = map(value, 0, 127, 0, width);
        document.getElementById('xSlider').value = circleX;
        break;
      case 2: // CC2 for Y
        circleY = map(value, 0, 127, 0, height);
        document.getElementById('ySlider').value = circleY;
        break;
    }
  }
}

function sendMIDI(control, value) {
  if (output) {
    output.send([0xB0 + MIDI_CHANNEL, control, Math.round(value)]);
    console.log(`Sent MIDI: CC${control} = ${value}`);
  } else {
    console.warn("No MIDI output connected");
  }
}