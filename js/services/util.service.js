export const utilService = {
    makeId,
    getLocStrHtml,
    saveToStorage,
    loadFromStorage,
    setQueryStringParams
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    let val = localStorage.getItem(key)
    return JSON.parse(val)
}

function makeId(length = 4) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'

    let txt = letters.charAt(Math.floor(Math.random() * letters.length))

    for (let i = 0; i < length - 1; i++) {
        txt += digits.charAt(Math.floor(Math.random() * digits.length))
    }
    return txt
}

function setQueryStringParams(lat, lng) {
    const queryStringParams = `?lat=${lat}&lng=${lng}`

    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function getLocStrHtml(loc) {
    const { name, createdAt, updatedAt, pos, id } = loc
    return `
    <details class="location flex space-between">
        <summary>
            <h3>
                <i class="fa-solid fa-location-dot"></i>
                <span>${name}</span>
            </h3>
        </summary>
  
        <p>
            <span>CreatedAt</span> 
            <span>${createdAt}</span>
        </p>
        <p>
            <span>EditedAt</span>
            <span>${updatedAt}</span>
         </p>
        <p>
            <span>Lat</span> 
            <span>${pos.lat}</span>
        </p>
        <p>
            <span>Lng</span> 
            <span>${pos.lng}</span>
        </p>
    
        <div class="btns-con">
            <button 
                class="btn btn-go" 
                onclick="onGoToLoc(${pos.lat},${pos.lng})"
            >
                <i class="fa-solid fa-location-dot"></i>
            </button>
            <button 
                class="btn btn-delete"
                onclick="onDeleteLoc('${id}')"
            >X
            </button>
        </div>
    </details>`
}