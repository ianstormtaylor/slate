import direction from 'direction'
import { Map } from 'immutable'

let cache = {}

/**
 * Get direction of a text
 * @param  {String} text
 * @return {String} dir?
 */

function getDirection(text) {
    if (cache[text]) {
        return cache[text]
    }

    let dir = direction(text)
    if (dir === 'neutral') {
        return
    }

    return dir
}


const bidi = {
    getDirection
}

export default bidi
