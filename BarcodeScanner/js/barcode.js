

var audio = document.getElementById('beepAudio');
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


    Quagga.onDetected(barcodeDetected)
    function barcodeDetected(data) {
        document.getElementById('quaggaVideo').pause()
        console.log('detectedObject', data);
        playBeep();
        alert(data.codeResult.code)
        Quagga.stop()
    }

}

function resetBarcodeScanner() {
    Quagga.stop();
}
function playBeep() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createBufferSource();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../sounds/beep.wav');
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function (r) {
        audioCtx.decodeAudioData(
            xhr.response,
            function (buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = false;
            });
        source.start(0);
    });
    xhr.send();
}

