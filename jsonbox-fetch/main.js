function GetData() {
    let body=document.createElement('body');
    let url = "https://jsonbox.io/box_4eb3e7d6bb577318d46a";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //data is the json object coming from the previous then()function
            //build the HTML from the data object
            data[0].info.forEach(element => {
                console.log(element);
                let p = document.createElement('p');
                let sp1=document.createElement('span');
                let sp2=document.createElement('span');
                let sp3=document.createElement('span');
                sp1.textContent="ID: "+element.num;
                p.appendChild(sp1);
                sp2.textContent="Book Name: "+element.name;
                p.appendChild(sp2);
                sp3.textContent="Price: "+element.price;
                p.appendChild(sp3);
                p.className="parag";
                document.getElementById('data_placeholder').appendChild(p);
            });

        })
        .catch(function (err) {
            alert(err);
        });
}

GetData();