import direction from 'direction'
import { OrderedMap, is } from 'immutable'

/**
 * Get text direction for a node
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
 * Calcul direction map for a node
 * @param  {Node} node
 * @param {OrderedMap} prevBidiMap?
 * @return {OrderedMap}
 */

function getDirectionMap(node, prevBidiMap) {
    let map = {}

    node.filterDescendants(child => {
        let dir = getDirForNode(child)
        map[child.key] = dir
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
