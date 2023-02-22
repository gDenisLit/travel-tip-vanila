export const weatherService = {
    getWeather,
}

const API_KEY = ''

function getWeather({ lat, lng }) {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='
    const params = `${lat}&lon=${lng}&appid=${API_KEY}`

    return fetch(baseUrl + params)
        .then(res => res.json())
        .then(res => {
            return {
                weather: res.weather[0].main,
                temp: res.main.temp,
                minTemp: res.main['temp_min'],
                maxTemp: res.main['temp_max'],
                windSpeed: res.wind.speed,
                state: res.sys.country,
            }
        })
}
