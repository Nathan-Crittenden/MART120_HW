// Parameters that will be controlled by Ableton
let shapeColor = [255, 255, 255];
let shapeX = 250;
let shapeY = 250;
let shapeSize = 100;
let opacity = 255;
let midiAccess;
let activeInput;

// Parameters to control
let bgColor = [0, 0, 0];
let shapeParams = {
  x: 250,
  y: 250,
  color: [255, 255, 255],
  size: 100,
  opacity: 255
};

function setup() {
  createCanvas(500, 500);
  colorMode(RGB, 255);
  setupMIDI();
}

function draw() {
  background(bgColor[0], bgColor[1], bgColor[2]);
  
  fill(shapeParams.color[0], shapeParams.color[1], shapeParams.color[2], shapeParams.opacity);
  noStroke();
  ellipse(shapeParams.x, shapeParams.y, shapeParams.size);
}

function setupMIDI() {
  // Check for WebMIDI support
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false })
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("WebMIDI is not supported in this browser");
  }
}

function onMIDISuccess(midi) {
  midiAccess = midi;
  const inputs = midiAccess.inputs.values();
  
  // List available MIDI devices
  console.log("MIDI Input Devices:");
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    console.log(input.value.name);
    input.value.onmidimessage = onMIDIMessage;
    activeInput = input.value;
  }
  
  // Also watch for device changes
  midiAccess.onstatechange = onStateChange;
}

function onMIDIFailure(error) {
  console.log("Failed to get MIDI access:", error);
}

function onStateChange(event) {
  console.log("MIDI device state changed:", event.port.name, event.port.state);
  if (event.port.state === "connected" && event.port.type === "input") {
    event.port.onmidimessage = onMIDIMessage;
    activeInput = event.port;
  }
}

function onMIDIMessage(message) {
  const [command, control, value] = message.data;
  
  // Only respond to CC messages (command 176-191)
  if (command >= 176 && command <= 191) {
    const channel = command - 175;
    const normalized = value / 127.0; // Convert to 0-1 range
    
    // Map CC numbers to parameters
    switch(control) {
      case 1: // Modulation wheel typically CC1
        bgColor[0] = value * 2;
        break;
      case 2:
        bgColor[1] = value * 2;
        break;
      case 3:
        bgColor[2] = value * 2;
        break;
      case 4:
        shapeParams.x = map(value, 0, 127, 0, width);
        break;
      case 5:
        shapeParams.y = map(value, 0, 127, 0, height);
        break;
      case 6:
        shapeParams.opacity = value * 2;
        break;
      // Add more controls as needed
    }
  }
}