function getRandomInt(min, max) {
    let range = max - min;
    let num = Math.floor(Math.random() * range) + min;
    return num;
}
let MainEl = document.getElementById("main");
document.body.addEventListener("click", () => {
    var img = document.createElement("img");
    var Rnd = getRandomInt(100, 500);
    img.src = "https://picsum.photos/id/" + Rnd + "/200/300";
    img.alt = "random image " + Rnd;
    img.addEventListener("error", () => {
        alert("No image could be loaded. Please click again.");
    });
    img.addEventListener("load", () => {
        MainEl.appendChild(img);
    });
});

