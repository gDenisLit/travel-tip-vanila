import { locationService } from './services/location.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit

function onInit() {
    onRenderLocs()
    onRenderWeather()
    onInitMap()
}

function onRenderLocs() {
    showLoader()
    locationService
        .getLocs()
        .then(renderLocs)
        .then(hideLoader)
        .then(addEventListeners)
        .catch(console.error)
}

function onRenderWeather() {
    const pos = mapService.getCurrPos()
    weatherService
        .getWeather(pos)
        .then(renderWeather)
        .catch(console.error)
}

function onInitMap() {
    mapService
        .initMap()
        .then(renderByQueryStringParams)
        .catch(console.error)
}

function onAddLoc(ev) {
    ev.preventDefault()
    const locName = document.querySelector('.loc-name').value
    if (!locName) return

    const currPos = mapService.getCurrPos()
    locationService
        .addLoc(currPos, locName)
        .then(onRenderLocs)
        .catch(console.error)
}

function onDeleteLoc(locId) {
    locationService
        .deleteLoc(locId)
        .then(onRenderLocs)
        .catch(console.error)
}

function onGoToLoc(lat, lng) {
    onPanTo({ lat, lng })
}

function onGoToUserPos() {
    mapService
        .getUserPos()
        .then(onPanTo)
        .catch(console.error)
}

function onSearchLocation(ev) {
    ev.preventDefault()
    const adress = document.querySelector('.search-input').value
    if (!adress) return

    mapService
        .getAddressCoords(adress)
        .then(({ pos, locName }) => {
            onPanTo(pos)
            locationService
                .addLoc(pos, locName)
                .then(onRenderLocs)
                .catch(console.error)
        })
        .catch(console.error)
}

function onPanTo({ lat, lng }) {
    mapService.panTo(lat, lng)
    mapService.addMarker({ lat, lng })
    utilService.setQueryStringParams(lat, lng)

    weatherService
        .getWeather({ lat, lng })
        .then(renderWeather)
}

function renderByQueryStringParams() {
    const { searchParams } = new URL(window.location)
    const pos = {
        lat: parseFloat(searchParams.get('lat')),
        lng: parseFloat(searchParams.get('lng')),
    }
    !isNaN(pos.lat) && !isNaN(pos.lng) && onPanTo(pos)
}

function onCopyUrl() {
    const { href } = window.location
    navigator.clipboard.writeText(href)
}

function renderLocs(locs) {
    const strHtml = locs.map(utilService.getLocStrHtml).join('')
    document.querySelector('.locations').innerHTML = strHtml
}

function addEventListeners() {
    window.onAddLoc = onAddLoc
    window.onGoToUserPos = onGoToUserPos
    window.onCopyUrl = onCopyUrl
    window.onSearchLocation = onSearchLocation
    window.onGoToLoc = onGoToLoc
    window.onDeleteLoc = onDeleteLoc
}

function renderWeather(weatherInfo) {
    const { weather, state, temp, minTemp, maxTemp, windSpeed } = weatherInfo
    document.querySelector('.weather-main').innerText = weather
    document.querySelector('.weather-state').innerText = state
    document.querySelector('.temp').innerText = temp + '°'
    document.querySelector('.min-temp').innerText = minTemp + '°'
    document.querySelector('.max-temp').innerText = maxTemp + '°'
    document.querySelector('.speed').innerText = windSpeed
}

function showLoader() {
    document.querySelector('.spinner').classList.remove('hide')
    document.querySelector('.locations').classList.add('hide')
}

function hideLoader() {
    document.querySelector('.spinner').classList.add('hide')
    document.querySelector('.locations').classList.remove('hide')
}