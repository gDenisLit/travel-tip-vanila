import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const locationService = {
    getLocs,
    addLoc,
    deleteLoc,
}

const LOCS_KEY = 'locsDB'

function getLocs() {
    return storageService.query(LOCS_KEY)
}

function addLoc(pos, name) {
    const loc = _createLoc(pos, name)
    return storageService.post(LOCS_KEY, loc)
}

function deleteLoc(locId) {
    return storageService.remove(LOCS_KEY, locId)
}

function _createLoc(pos, name) {
    return {
        name,
        pos,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}

; (() => {
    let locs = utilService.loadFromStorage(LOCS_KEY)
    if (!locs || !locs.length) {
        locs = [
            _createLoc({ lat: 32.047104, lng: 34.832384 }, 'Greatplace'),
            _createLoc({ lat: 32.047201, lng: 34.832581 }, 'Neveragain'),
        ]
    }
    utilService.saveToStorage(LOCS_KEY, locs)
})()