
var audio = new Audio('/dist/sounds/beep.wav');
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
        audio.play();
        alert(data.codeResult.code)
        Quagga.stop()
    }

}

function resetBarcodeScanner() {
    Quagga.stop();
}

