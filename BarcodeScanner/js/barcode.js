if (!('BarcodeDetector' in window)) { alert('Barcode detector is not supported in this OS!') }

let codes = [];
const seen = new Set();

let formats;
// Save all formats to formats var 
BarcodeDetector.getSupportedFormats().then(item => formats = item);
// Create new barcode detector
const barcodeDetector = new BarcodeDetector({ formats: formats });

// Define custom element
customElements.define('scaned-item', class extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('#scaned-item').content;
        const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
    };
});

// Codes proxy/state
const codesProxy = new Proxy(codes, {
    set(target, prop, value, receiver) {
        // Throw err if value is a number
        // Stops from saving undefined codes
        if (typeof value === 'number') throw value;

        target.push(value);

        // Check if code has already been scanned
        target = target.filter((c) => {
            if (c.rawValue !== window.barcodeVal) return c;
            const d = seen.has(c.rawValue);
            seen.add(c.rawValue);
            return !d;
        })
        printBarcodeOutput(value.rawValue)
        return true;
    }
});
const printBarcodeOutput = (value) => {
    console.info('Barcode result is: ', value);
    alert(value)
}
// Get video element 
const video = document.getElementById('video');
var streamObj;
// Check for a camera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
        video: { deviceId: myPreferredCameraDeviceId },
        audio: false
    };

    // Start video stream
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        video.srcObject = stream
        streamObj = stream;
    });
}

// Draw outline to canvas 
const drawCodePath = ({ cornerPoints }) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const strokeGradient = ctx.createLinearGradient(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    console.log('cornerPoints:', cornerPoints.entries(), canvas.scrollWidth, canvas.scrollHeight)
    // Exit function and clear canvas if no corner points
    //if (!cornerPoints) return ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clear canvas for new redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create new gradient
    strokeGradient.addColorStop('0', '#c471ed');
    strokeGradient.addColorStop('1', '#f7797d');

    // Define stoke styles
    ctx.strokeStyle = strokeGradient;
    ctx.lineWidth = 4;

    // Begin draw
    ctx.beginPath();
    const xOffset = canvas.width / 4;
    const yOffset = canvas.height / 4;
    // Draw code outline path
    for (const [i, { x, y }] of cornerPoints.entries()) {
        console.log(i, x, y)
        if (i === 0) {
            // Move x half of the stroke width back 
            // makes the start and end corner line up
            ctx.moveTo(x + xOffset, y + yOffset);
            continue;
        }
        // Draw line from current pos to x, y
        ctx.lineTo(x + xOffset, y + yOffset);
        // Complete square draw to starting position
        if (i === cornerPoints.length - 1) ctx.lineTo(cornerPoints[0].x + xOffset, cornerPoints[0].y + yOffset);
    }

    // Make path to stroke
    ctx.stroke();
}
var isDetected = false;
var audio = new Audio('/BarcodeScanner/sounds/beep.wav');
// Detect code function 
const detectCode = () => {
    barcodeDetector.detect(video).then(codes => {
        // If no codes exit function and clear canvas
        //if (codes.length === 0) return drawCodePath({});

        for (const barcode of codes) {
            console.log(barcode)
            // Draw outline
            video.pause();
            isDetected = true;
            if (isDetected)
                drawCodePath(barcode);
            // Code in seen set then exit loop 
            if (seen.has(barcode.rawValue)) return;

            // Save barcode to window to use later on
            // then push to the codes proxy
            window.barcodeVal = barcode.rawValue;
            codesProxy.push(barcode);
        }
    }).catch(err => {
        console.log(err);
    })
}

// Run detect code function every 100 milliseconds
const detectInterval = setInterval((interval) => {
    detectCode();
    if (isDetected) {
        audio.play();
        clearInterval(detectInterval);
        streamObj.getTracks().forEach(function (track) {
            track.stop();
        });
    }
}, 100);
