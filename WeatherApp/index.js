import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation, getAddress } from './map.service.js'
const storageCoordinateKey = 'cordWheaterApp0017'
const storageForcastKey = 'forcWheaterApp0017'



let cityName = ''
let screen = $('#top-content')
let midContent = $('#middle-content')
let hourlyButton = $('#btn-hourly')
let dailyButton = $('#btn-daily')
async function main() {
    let promptMade = await makePrompt()
    if (!promptMade) {
        let forcast = await getCachedForcast()
        if (forcast)
            showForcastOnScreen(forcast)
        else
            alert('We could not find wheater statistics')
    }
    hourlyButton.click(showHourlyStats)
    dailyButton.click(showDailyStats)
    showHourlyStats()
    let submitLocationBtn = $('#main-submit-location-btn')
    submitLocationBtn.click(async function () {
        let address = $('#main-location-inp')
        await handleSubmitLocation(address)
    })

    let findMeBtn = $('#main-find-location-btn')
    findMeBtn.click(handleFindMe)
}
main()




function showHourlyStats() {
    hourlyButton.css('background-color', '#03dcff')
    hourlyButton.css('color', 'white')
    dailyButton.css('background-color', '#ababab')
    dailyButton.css('color', 'black')
    $('#daily-stats').css('display', 'none')
    $('#hourly-stats').css('display', 'flex')
}
function showDailyStats() {
    dailyButton.css('background-color', '#03dcff')
    dailyButton.css('color', 'white')
    hourlyButton.css('background-color', '#ababab')
    hourlyButton.css('color', 'black')
    $('#daily-stats').css('display', 'block')
    $('#hourly-stats').css('display', 'none')
}
async function makePrompt() {
    let coords = getCachedCoordinates()
    console.log('makePrompt: ', coords)
    if (!coords) {
        let template = `<div id="location-modal" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-center">
            <div class="modal-header">
              <h5 class="modal-title">Please insert your location!</h5>
            </div>
            <div class="modal-body">
              <input id="location-inp" required type="text" class="form-control text-center w-100" placeholder="My address is ..."/>
              <button class="btn btn-success mt-3" id="submit-location-btn">Set Location</button>
              <button class="btn btn-info mt-3" id="find-location-btn">Find Me <i class="fas fa-map-marker-alt"></i></button>
            </div>
          </div>
        </div>
      </div>`;
        $('#root').append(template)
        let modal = $('#location-modal')
        modal.modal({ backdrop: false })

        let submitLocationBtn = $('#submit-location-btn')
        submitLocationBtn.click(async function () {
            let address = $('#location-inp')
            await handleSubmitLocation(address)
        })

        let findMeBtn = $('#find-location-btn')
        findMeBtn.click(async function () {
            await handleFindMe()
        })

        return true
    }
    return false
}





async function getWholeForcast(coords) {
    try {
        displayLoader()
        const forcast = await getForecast({ units: 'metric', coord: coords })
        cityName = await getAddress(coords)
        hideLoader()
        updateCachedForcast(forcast)
        return forcast
    }
    catch (error) {
        console.log(error.message)
        return null
    }
}

async function handleSubmitLocation(address) {
    let addressText = address.val()
    if (addressText) {
        const coords = await getGeolocation(addressText)
        console.log('handleSubmitLocation: ', coords)
        if (coords) {
            updateCachedCoordinates(coords)
            let forcast = await getWholeForcast(coords)
            if (forcast) {
                $('#location-modal').modal('hide')
                showForcastOnScreen(forcast)
            }
            else
                alert('We could not find wheater statistics for: (' + addressText + ')')
        }
        else {
            alert('please try again!')
        }
    }
    else {
        alert('Please enter the address you want before tapping (Set Location) button');
    }
}

async function handleFindMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const coords = { lat: position.coords.latitude, lon: position.coords.longitude }
            console.log('handleSubmitLocation: ', coords)
            if (coords) {
                updateCachedCoordinates(coords)
                $('#location-modal').modal('hide')
                let forcast = await getWholeForcast(coords)
                if (forcast) {
                    showForcastOnScreen(forcast)
                }
                else {
                    alert('We could not find wheater statistics')
                    $('#location-modal').modal('show')
                }
            }
            else {
                alert('please try again!')
            }
        });
    }
    else {
        alert("Geolocation is not supported");
    }
}


function showForcastOnScreen(forcast) {
    const { current, daily, hourly } = forcast
    midContent.html('')
    screen.html('')
    prepareCurrent(current)
    prepareDaily(daily)
    prepareHourly(hourly)
    showHourlyStats()
}
function prepareCurrent(current) {
    let { weather, feels_like, humidity, temp } = current
    let { icon, description } = weather[0]
    let img = createWeatherIcon(icon)
    let template = `${img}
    <div class="card-body current-card-body">
        <h1 class="card-title" id="current-location-name">${cityName}</h1>
        <h1 class="card-text">${temp.toFixed(0)}°</h1>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">Humidity: ${humidity}%</li>
        <li class="list-group-item">Feels like: ${feels_like}°</li>
        <li class="list-group-item">Status: ${description}</li>
    </ul>`
    screen.prepend(template)
}
function prepareDaily(daily) {
    console.log('daily shown: ', daily)
    let items = ``;
    for (let index = 0; index < 6; index++) {
        const element = daily[index];
        items += `<div class="col-12 daily-card-body">
                    <h5>Friday</h5>
                    <img src="https://openweathermap.org/img/w/${element.weather[0].icon}.png" alt="..." />
                    <h5><i class="fas fa-arrow-up">${element.temp.max.toFixed(0)}°</i></h5>
                    <h5><i class="fas fa-arrow-down">${element.temp.min.toFixed(0)}°</i></h5>
                 </div>`
    }
    let template = `<div id="daily-stats" class="row">
                            ${items}
                    </div>`
    midContent.append(template)
}
function prepareHourly(hourly) {
    console.log('hourly shown: ', hourly)
    let items = ``;
    for (let index = 0; index < 6; index++) {
        const element = hourly[index];
        items += `<div class="col-2 hourly-card-body">
        <h5>1PM</h5>
        <img src="https://openweathermap.org/img/w/${element.weather[0].icon}.png" alt="..." />
        <h5>${element.temp.toFixed(0)}°</h5>
    </div>`
    }
    let template = `<div id="hourly-stats" class="row">
                            ${items}
                    </div>`
    midContent.append(template)
}
function updateCachedCoordinates(data) {
    localStorage.setItem(storageCoordinateKey, JSON.stringify(data))
}

function getCachedCoordinates() {
    let temp = localStorage.getItem(storageCoordinateKey)
    temp = temp ? JSON.parse(temp) : null
    return temp
}

function updateCachedForcast(data) {
    localStorage.setItem(storageForcastKey, JSON.stringify(data))
}

async function getCachedForcast() {
    displayLoader()
    let temp = localStorage.getItem(storageForcastKey)
    cityName = await getAddress(getCachedCoordinates())
    temp = temp ? JSON.parse(temp) : null
    hideLoader()
    return temp
}

function displayLoader() {
    let modal = $('#loader-modal')
    modal.modal('show')
}

function hideLoader() {
    let modal = $('#loader-modal')
    modal.modal('hide')
}