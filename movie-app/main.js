let apiKey = "3a3c2bad5c53a3e1313f172e849d1f6f";
let GeneralData={};


function actorMovies(id) {
  let response = getData("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + apiKey);
}

function castDetail(id) {
  let response = getData("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + apiKey);
}

const imgSizes = {
  backdrop_sizes: ["w300", "w780", "w1280", "original"],
  logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
  poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  profile_sizes: ["w45", "w185", "h632", "original"],
  still_sizes: ["w92", "w185", "w300", "original"]
};
const APP = {
  active: "HOME",
  imgURL: "https://image.tmdb.org/t/p",
  pages: [],
  baseURL: null,
  init: () => {
    APP.pages = document.querySelectorAll(".page");
    let links = document.querySelectorAll("[data-href]");
    links.forEach(link => {
      link.addEventListener("click", APP.nav);
    });
    //get the base url to use in the app
    APP.baseURL = location.href.split("#")[0];
    let hash = location.hash;
    //check for current url hash
    if (hash && hash != "#") {
      //there is an id in the url
      APP.active = hash.replace("#", "");
      APP.showPage(APP.active);
    } else {
      //no url so use our default
      history.replaceState({}, APP.active, `${APP.baseURL}#${APP.active}`);
      APP.showPage(APP.active);
    }
    //handle the back button
    window.addEventListener("popstate", APP.poppy);
  },
  nav: ev => {
    ev.preventDefault();
    ev.stopPropagation();
    let link = ev.target;
    let target = link.getAttribute("data-href");
    if ((target != "ACTORS") || (target == "ACTORS" && document.getElementById('searchString').value)) {
      //update URL
      history.pushState({}, target, `${APP.baseURL}#${target}`);
      //change the display of the "page"
      APP.showPage(target);
      //use switch case with target for page specific things
    }
  },
  showPage: target => {
    document.querySelector(".active").classList.remove("active");
    document.querySelector(`#${target}`).classList.add("active");
  },
  poppy: ev => {
    //get the id
    let target = location.hash.replace("#", "");
    APP.showPage(target);
  },
  search: ()=>{
    let par=document.getElementById("ActorsList");
    par.innerHTML="";
    if (document.getElementById('searchString').value) {
      document.getElementById("AHeader").textContent="Result actors ("+document.getElementById('searchString').value+")";
      fetch("https://api.themoviedb.org/3/search/person?api_key=" + apiKey + "&query=" + document.getElementById('searchString').value)
      .then(function (response) {
        return response.json();
      })
      .then(function (data){
        GeneralData=data.results;
        GeneralData.forEach(actor=>{
          var acDiv=document.createElement('div');
          var img= document.createElement('img');
          img.src=actor.profile_path?APP.imgURL+"/"+imgSizes.profile_sizes[1]+actor.profile_path:"img/default.jpg";
          acDiv.appendChild(img);
          var c=document.createElement("a");c.textContent=actor.name;c.href="#MOVIES";c.id=actor.id;c.className="personID";
          acDiv.appendChild(c);
          par.appendChild(acDiv);
        })
        let links2 = document.getElementsByClassName("personID");
        for (let link of links2) {
          link.addEventListener("click", APP.actorMovies);
      }
      });
    } else
      alert("please type your desired name then push search button again!");
  },
  actorMovies:ev=>{
    let par=document.getElementById("MoviesList");
    par.innerHTML="";
    let selectedActor={};
        GeneralData.forEach(actor=>{
          if(actor.id==ev.target.id)
          {
            selectedActor=actor;
            document.getElementById("MHeader").textContent="MOVIES of ("+actor.name+")";
            selectedActor.known_for.forEach(movie=>{
              if(movie.media_type=="movie")
              {
              let acDiv=document.createElement('div');
              let img= document.createElement('img');
              img.src=movie.poster_path?APP.imgURL+"/"+imgSizes.poster_sizes[2]+movie.poster_path:"img/default.jpg";
              acDiv.appendChild(img);
              let title=document.createElement('div');title.textContent=movie.title;
              acDiv.appendChild(title);
              let release_date=document.createElement('span');release_date.textContent="Release date: "+movie.release_date;
              acDiv.appendChild(release_date);
              let c=document.createElement("a");c.textContent="More info ...";c.href="#MOVIE_DETAIL";c.className="KnownMovie";c.id=movie.id;
              acDiv.appendChild(c);
              par.appendChild(acDiv);
              }
            })
            return;
          }
        })
        let links3 = document.getElementsByClassName("KnownMovie");
        for (let link of links3) {
          link.addEventListener("click", APP.detailMovie);
      }
  },
  detailMovie:ev=>{
    let par=document.getElementById("MovieDetail");
    par.innerHTML="";
      document.getElementById("AHeader").textContent="Result actors ("+document.getElementById('searchString').value+")";
      fetch("https://api.themoviedb.org/3/movie/"+ev.target.id+"?api_key=" + apiKey)
      .then(function (response) {
        return response.json();
      })
      .then(function (data){
        document.getElementById("DHeader").textContent="MOVIE ("+data.title+")";
          let acDiv=document.createElement('div');
          let img= document.createElement('img');
          img.src=data.poster_path?APP.imgURL+"/"+imgSizes.poster_sizes[3]+data.poster_path:"img/default.jpg";
          acDiv.appendChild(img);
          let tempDiv=document.createElement('div');
          let title=document.createElement('div');title.textContent=data.title;
          tempDiv.appendChild(title);tempDiv.id="tempDiv";
          let release_date=document.createElement('span');release_date.textContent="Release date: "+data.release_date;
          tempDiv.appendChild(release_date);
          let credits=document.createElement('span');credits.textContent="Credits: ";
          tempDiv.appendChild(credits);
          acDiv.appendChild(tempDiv);
          par.appendChild(acDiv);
          fetch("https://api.themoviedb.org/3/movie/"+ev.target.id+"/credits?api_key=" + apiKey)
          .then(function (response) {
            return response.json();
          })
          .then(function (data){
            console.log(data);
              let acDiv=document.getElementById('acDiv');
              let list=document.createElement('ul');list.id="list";
              data.cast.slice(0,3).forEach(cast=>{
                let li=document.createElement('li');
                li.textContent="Actor name: "+cast.name+"   Character: "+cast.character;
                list.appendChild(li);
              })
              tempDiv.appendChild(list);
          });
      });
  }
};

document.addEventListener("DOMContentLoaded", APP.init);