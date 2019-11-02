function GetData() {
    let body=document.createElement('body');
    let url = "https://picsum.photos/v2/list?limit=8";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //data is the json object coming from the previous then( ) function
            //build the HTML from the data object
            data.forEach(element => {
                let img = document.createElement('img');
                img.src="https://picsum.photos/id/"+element.id+"/400/300"
                img.alt = element.author;
                document.body.appendChild(img);
            });
            console.log(data);
        })
        .catch(function (err) {
            alert(err);
        });
}

GetData();