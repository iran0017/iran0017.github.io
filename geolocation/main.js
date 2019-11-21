let map, G, options, spans;
let msg = document.getElementById('msg');
document.addEventListener("DOMContentLoaded", () => {
    let s = document.createElement('script');
    document.head.appendChild(s);
    s.addEventListener('load', () => {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.34,
                lng: -75.75
            },
            zoom: 14
        });
        if (navigator.geolocation) {
            let giveUp = 1000 * 30;
            let tooOld = 1000 * 60 * 60;
            options = {
                enableHighAccuracy: true,
                timeout: giveUp,
                maximumAge: tooOld
            }
            navigator.geolocation.getCurrentPosition(gotPos, posFail, options);
            msg.textContent = "trying to determine the current location ...";
        }
    })
    s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8xd-2hRJvMebs3XA5FPKhhgnNDY9t0co";
})

function gotPos(position) {
    map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
    });
    var marker = new google.maps.Marker({
        position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        map: map,
        title: 'Hello World!'
      });
    msg.style = "background-color:#ade6c4;color:#277b3f;transition-duration:3s;white-space: pre;";
    setTimeout(function () {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyB8xd-2hRJvMebs3XA5FPKhhgnNDY9t0co";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                msg.textContent="Latitude: " + position.coords.latitude + " Longtitude: " + position.coords.longitude+"\r\n\r\nThe formatted_address is: "+data.results[0].formatted_address;
            })
            .catch(err => console.warn(err.message))
    }, 1000);
}

function posFail(err) {
    let errors = {
        1: "No permission",
        2: "Unable to determine",
        3: "Took too long"
    }
    msg.textContent = errors[err];
    msg.style = "background-color:#ff9393;color:#9c1b1f;";

}