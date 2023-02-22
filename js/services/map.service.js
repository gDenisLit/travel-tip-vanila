import { utilService } from './util.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCurrPos,
    getUserPos,
    getAddressCoords,
}

let gMap
let gCurrPos = { lat: 32.0749831, lng: 34.9120554 }
const API_KEY = ''

function getCurrPos() {
    return gCurrPos
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15,
            })
            gMap.addListener('click', ev => {
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()

                addMarker(ev.latLng)
                panTo(lat, lng)


                utilService.setQueryStringParams(lat, lng)
            })
        })
}

function addMarker(position) {
    let marker = new google.maps.Marker({
        position,
        map: gMap,
        title: 'Hello World!',
    })
    return marker
}

function panTo(lat, lng) {
    let laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
    gCurrPos = { lat, lng }
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    let elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getUserPos() {
    if (!navigator.geolocation) return
    return new Promise((resolve, reject) => {
        return navigator
            .geolocation
            .getCurrentPosition(resolve, reject)
    })
        .then(({ coords }) => {
            return {
                lat: coords.latitude,
                lng: coords.longitude,
            }
        })
}

function getAddressCoords(address) {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='
    const params = `${address}&language=en&key=${API_KEY}`

    return fetch(baseUrl + params)
        .then(response => response.json())
        .then(res => res.results[0])
        .then(data => {
            return {
                pos: {
                    lat: data.geometry.location.lat,
                    lng: data.geometry.location.lng,
                },
                locName: data['address_components'][0]['long_name'],
            }
        })
}