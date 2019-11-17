function Initiate() {
    let dataFile1 = fetch('https://jsonbox.io/box_7ebd8cb0b8fb187873ef');
    let dataFile2 = fetch('https://jsonbox.io/box_82b5a4aa7a4a71abaa80');
    Promise.race([dataFile1, dataFile2])
        .then(function (files) {
            files.json().then(file => {
                file.forEach(element => {
                    process(element);
                });
            });
        })
        .catch(err => {

        });
    let process = (elm) => {
        if (elm.type == 'archer') {
            elm.data.forEach(dat => {
                let p = document.createElement('p');
                p.textContent = dat.first_name + " " + dat.last_name;
                document.getElementById('output').appendChild(p);
            })
        } else {
            elm.data.forEach(dat => {
                let p = document.createElement('p');
                p.textContent = "Character: " + dat.character + "  ------>>>> Actor: " + dat.actor;
                document.getElementById('output').appendChild(p);
            })
        }
        let p = document.createElement('p');
        p.textContent = "Json object Type: " + elm.type;
        p.style = "border-top:1px solid;padding:10px 0;font-size:30px;";
        document.getElementById('output').appendChild(p);
    }
}