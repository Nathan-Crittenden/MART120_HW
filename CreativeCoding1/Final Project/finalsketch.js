let clouds = [];
let rainDrops = [];
let isNightMode = false;

// MIDI-controlled parameters
let cloudSpeed = 1.0;
let rainSpeed = 5.0;

// MIDI keyboard visualization
const NOTE_RANGE = { low: 36, high: 84 }; // C2 to C6
let activeNotes = new Map();
let midiAccess;
let output;
let midiStatus = "Initializing...";
const MIDI_CHANNEL = 0;

const windowPositions = [
// Left column windows
// Left column windows
{x: 241, y: 546}, {x: 350, y: 546}, {x: 458, y: 546}, {x: 580, y: 546}, {x: 691, y: 546}, {x: 799, y: 546},
{x: 241, y: 698}, {x: 349, y: 698}, {x: 458, y: 698}, {x: 580, y: 698}, {x: 691, y: 698}, {x: 799, y: 698},
{x: 241, y: 844}, {x: 349, y: 844}, {x: 458, y: 844}, {x: 580, y: 844}, {x: 691, y: 844}, {x: 799, y: 844},
{x: 241, y: 1000}, {x: 349, y: 1000}, {x: 458, y: 1000}, {x: 580, y: 1000}, {x: 691, y: 1000}, {x: 799, y: 1000},

// Right column windows
{x: 1088, y: 546}, {x: 1207, y: 546}, {x: 1327, y: 546}, {x: 1455, y: 546}, {x: 1575, y: 546}, {x: 1694, y: 546},
{x: 1088, y: 697}, {x: 1207, y: 697}, {x: 1327, y: 697}, {x: 1455, y: 697}, {x: 1575, y: 697}, {x: 1694, y: 697},
{x: 1088, y: 848}, {x: 1207, y: 848}, {x: 1327, y: 848}, {x: 1455, y: 848}, {x: 1575, y: 848}, {x: 1694, y: 848},
{x: 1088, y: 998}, {x: 1207, y: 998}, {x: 1327, y: 998}, {x: 1455, y: 998}, {x: 1575, y: 998}, {x: 1694, y: 998}
];
// Array to store note assignments to windows
let shuffledNotes = [];

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas');
    colorMode(HSB, 360, 100, 100);
    
    // Make canvas transparent
    background(0, 0, 0, 0);

    updateBackgroundColor();
    
    // Initialize clouds
    clouds = [
        {x: 200, y: 150, scale: 1.0, relativeSpeed: 0.8, dayColor: [255, 255, 255], nightColor: [80, 80, 80]},
        {x: 400, y: 100, scale: 1.2, relativeSpeed: 1.0, dayColor: [255, 255, 255], nightColor: [70, 70, 70]},
        {x: 600, y: 180, scale: 0.8, relativeSpeed: 0.4, dayColor: [255, 255, 255], nightColor: [90, 90, 90]},
        {x: 50, y: 200, scale: 0.5, relativeSpeed: 0.6, dayColor: [255, 255, 255], nightColor: [85, 85, 85]},
        {x: 700, y: 300, scale: 0.9, relativeSpeed: 0.7, dayColor: [255, 255, 255], nightColor: [75, 75, 75]},
        {x: 350, y: 250, scale: 1.2, relativeSpeed: 1.1, dayColor: [255, 255, 255], nightColor: [95, 95, 95]},
        {x: 70, y: 180, scale: 0.4, relativeSpeed: 0.5, dayColor: [255, 255, 255], nightColor: [85, 85, 85]}
    ];
    
    // Initialize rain drops
    for (let i = 0; i < 200; i++) {
        rainDrops.push({
            x: random(width),
            y: random(-height, 0),
            length: random(10, 30),
            speed: random(5, 10)
        });
    }
    
    // Initialize note assignments
    initializeNoteAssignments();
    
    initMIDI();
}

function initializeNoteAssignments() {
    // Create an array of all possible notes
    const allNotes = Array.from({length: NOTE_RANGE.high - NOTE_RANGE.low + 1}, 
        (_, i) => i + NOTE_RANGE.low);
    
    // Shuffle the notes to randomize their assignment to windows
    shuffledNotes = shuffleArray(allNotes);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function draw() {
    clear(0, 0, 0, 0);
    
    // Draw the window notes first (behind everything else)
    drawWindowNotes();
    
    // Set background
    push();
    drawingContext.globalCompositeOperation = 'destination-over';
    if (isNightMode) {
        background(10, 12, 60, 0);
    } else {
        background(135, 206, 235, 0);
    }
    pop();
    
    // Draw and update rain
    drawRain();
    
    // Update and draw all clouds
    for (let cloud of clouds) {
        updateCloud(cloud);
        drawCloud(cloud);
    }
    
    // Display MIDI status
    fill(255);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text(midiStatus, 10, 10);
}

function drawWindowNotes() {
    colorMode(HSB, 360, 100, 100);
    
    activeNotes.forEach((noteData, note) => {
        const noteIndex = shuffledNotes.indexOf(note);
        
        const windowIndex = noteIndex % windowPositions.length;
        const windowPos = windowPositions[windowIndex];
        
        // Draw the rectangle
        fill(noteData.color);
        noStroke();
        rectMode(CENTER);
        rect(windowPos.x, windowPos.y, 70, 95);
    });
    
    colorMode(RGB, 255);
}
function drawRain() {
    stroke(70, 130, 180, 150);
    strokeWeight(1);
    
    for (let drop of rainDrops) {
        line(drop.x, drop.y, drop.x, drop.y + drop.length);
        drop.y += drop.speed * (rainSpeed / 5);
        
        if (drop.y > height) {
            drop.y = random(-100, 0);
            drop.x = random(width);
        }
    }
}

function updateCloud(cloud) {
    cloud.x += cloud.relativeSpeed * cloudSpeed;
    
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
    
    if (isNightMode) {
        fill(cloud.nightColor[0], cloud.nightColor[1], cloud.nightColor[2]);
    } else {
        fill(255);
    }
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

function updateBackgroundColor() {
    const bgColor = document.getElementById('bg-color');
    if (isNightMode) {
        bgColor.style.backgroundColor = 'rgb(10, 12, 60)';
    } else {
        bgColor.style.backgroundColor = 'rgb(135, 206, 235)';
    }
}


function handleMIDIMessage(message) {
    const [command, note, value] = message.data;
    const noteOn = (command >> 4) === 0x9 && value > 0;
    const noteOff = (command >> 4) === 0x8 || ((command >> 4) === 0x9 && value === 0);
    const controlChange = (command >> 4) === 0xB;
    
    // Handle keyboard notes (C2-C6)
    if (note >= NOTE_RANGE.low && note <= NOTE_RANGE.high) {
        if (noteOn) {
            const hue = random(360);
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
    
    // Handle control messages
    if (controlChange && (command & 0xF) === MIDI_CHANNEL) {
        switch(note) {
            case 1:
                cloudSpeed = map(value, 0, 127, 0, 3);
                break;
            case 2:
                rainSpeed = map(value, 0, 127, 0.5, 15);
                break;
            case 3:
                isNightMode = value > 63;
                updateBackgroundColor();
                break;
        }
    }
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
                },
                (err) => {
                    midiStatus = "MIDI access denied: " + err.message;
                    document.getElementById('midi-status').textContent = midiStatus;
                }
            );
    } else {
        midiStatus = "WebMIDI not supported";
        document.getElementById('midi-status').textContent = midiStatus;
    }
}

function setupMIDIInputs() {
    const inputs = midiAccess.inputs.values();
    let hasInputs = false;
    
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        if (input.value.name.includes("Ableton")) {
            input.value.onmidimessage = handleMIDIMessage;
            hasInputs = true;
        }
    }
    
    if (!hasInputs) {
        midiStatus = "No MIDI inputs found";
        document.getElementById('midi-status').textContent = midiStatus;
    }
    
    midiAccess.onstatechange = (event) => {
        if (event.port.state === "connected" && event.port.type === "input") {
            setupMIDIInputs();
        }
    };
}

function setupMIDIOutputs() {
    midiAccess.outputs.forEach(outputPort => {
        if (outputPort.name.includes("loopMIDI")) {
            output = outputPort;
        }
    });
}

function sendMIDI(control, value) {
    if (output) {
        output.send([0xB0 + MIDI_CHANNEL, control, Math.round(value)]);
    }
}

function windowResized() {
    resizeCanvas(1920, 1080);
}