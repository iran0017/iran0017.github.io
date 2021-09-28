
const beepAudioPath = '/BarcodeScanner/sounds/beep.wav'
function initBarcodeScanner(videoContainer) {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById(videoContainer)
        },
        decoder: {
            readers: ["code_128_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

}
Quagga.onDetected(barcodeDetected)
function barcodeDetected(data) {
    document.getElementById('quaggaVideo').pause()
    console.log('detectedObject', data);
    playBeep();
    alert(data.codeResult.code)
    Quagga.stop()
}
function resetBarcodeScanner() {
    Quagga.stop();
}

function playBeep() {
    // noinspection JSUnresolvedVariable
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', beepAudioPath);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', () => {
        let playsound = (audioBuffer) => {
            let source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.loop = false;
            source.start();
        };
        audioCtx.decodeAudioData(xhr.response).then(playsound);
    });
    xhr.send();
}

