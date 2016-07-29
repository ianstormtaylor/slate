import direction from 'direction'
import { OrderedMap, is } from 'immutable'

/**
 * Get text direction for a block
 * @param  {Node} node
 * @return {String} dir?
 */

function getDirForNode(node) {
    let dir = direction(node.text)
    if (dir === 'neutral') {
        return
    }

    return dir
}

/**
 * Calcul direction map for all blocks
 * @param  {Node} node
 * @param {OrderedMap} prevBidiMap?
 * @return {OrderedMap}
 */

function getDirectionMap(node, prevBidiMap) {
    let map = {}
    let lastValue = 'ltr'

    node.filterDescendants(child => {
        if (child.kind !== 'block') return

        let dir = getDirForNode(child) || lastValue
        map[child.key] = dir
        lastValue = dir
    })

    let bidiMap = new OrderedMap(map)

    if (prevBidiMap != null && is(prevBidiMap, bidiMap)) {
        return prevBidiMap
    }

    return bidiMap
}

const bidi = {
    getDirectionMap
}

export default bidi
