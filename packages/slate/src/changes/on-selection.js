import { is } from 'immutable'
import isEmpty from 'is-empty'
import pick from 'lodash/pick'

import Range from '../models/range'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.select = (change, properties, options = {}) => {
  properties = Range.createProperties(properties)
  const { snapshot = false } = options
  const { value } = change
  const { document, selection } = value
  const props = {}
  const next = selection.merge(properties).normalize(document)

  // Re-compute the properties, to ensure that we get their normalized values.
  properties = pick(next, Object.keys(properties))

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (snapshot === true || !is(properties[k], selection[k])) {
      props[k] = properties[k]
    }
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  if (
    selection.marks &&
    !props.marks &&
    (props.hasOwnProperty('anchorKey') ||
      props.hasOwnProperty('anchorOffset') ||
      props.hasOwnProperty('focusKey') ||
      props.hasOwnProperty('focusOffset'))
  ) {
    props.marks = null
  }

  // If there are no new properties to set, abort to avoid extra operations.
  if (isEmpty(props)) {
    return
  }

  change.applyOperation(
    {
      type: 'set_selection',
      value,
      properties: props,
      selection: selection.toJSON(),
    },
    snapshot ? { skip: false, merge: false } : {}
  )
}

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes.selectAll = change => {
  const { value } = change
  const { document, selection } = value
  const next = selection.moveToRangeOf(document)
  change.select(next)
}

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes.snapshotSelection = change => {
  const { value } = change
  const { selection } = value
  change.select(selection, { snapshot: true })
}

/**
 * Move the anchor point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes.moveAnchorCharBackward = change => {
  const { value } = change
  const { document, selection, anchorText, anchorBlock } = value
  const { anchorOffset } = selection
  const previousText = document.getPreviousText(anchorText.key)
  const isInVoid = document.hasVoidParent(anchorText.key)
  const isPreviousInVoid =
    previousText && document.hasVoidParent(previousText.key)

  if (!isInVoid && anchorOffset > 0) {
    change.moveAnchor(-1)
    return
  }

  if (!previousText) {
    return
  }

  change.moveAnchorToEndOf(previousText)

  if (!isInVoid && !isPreviousInVoid && anchorBlock.hasNode(previousText.key)) {
    change.moveAnchor(-1)
  }
}

/**
 * Move the anchor point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes.moveAnchorCharForward = change => {
  const { value } = change
  const { document, selection, anchorText, anchorBlock } = value
  const { anchorOffset } = selection
  const nextText = document.getNextText(anchorText.key)
  const isInVoid = document.hasVoidParent(anchorText.key)
  const isNextInVoid = nextText && document.hasVoidParent(nextText.key)

  if (!isInVoid && anchorOffset < anchorText.text.length) {
    change.moveAnchor(1)
    return
  }

  if (!nextText) {
    return
  }

  change.moveAnchorToStartOf(nextText)

  if (!isInVoid && !isNextInVoid && anchorBlock.hasNode(nextText.key)) {
    change.moveAnchor(1)
  }
}

/**
 * Move the focus point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes.moveFocusCharBackward = change => {
  const { value } = change
  const { document, selection, focusText, focusBlock } = value
  const { focusOffset } = selection
  const previousText = document.getPreviousText(focusText.key)
  const isInVoid = document.hasVoidParent(focusText.key)
  const isPreviousInVoid =
    previousText && document.hasVoidParent(previousText.key)

  if (!isInVoid && focusOffset > 0) {
    change.moveFocus(-1)
    return
  }

  if (!previousText) {
    return
  }

  change.moveFocusToEndOf(previousText)

  if (!isInVoid && !isPreviousInVoid && focusBlock.hasNode(previousText.key)) {
    change.moveFocus(-1)
  }
}

/**
 * Move the focus point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes.moveFocusCharForward = change => {
  const { value } = change
  const { document, selection, focusText, focusBlock } = value
  const { focusOffset } = selection
  const nextText = document.getNextText(focusText.key)
  const isInVoid = document.hasVoidParent(focusText.key)
  const isNextInVoid = nextText && document.hasVoidParent(nextText.key)

  if (!isInVoid && focusOffset < focusText.text.length) {
    change.moveFocus(1)
    return
  }

  if (!nextText) {
    return
  }

  change.moveFocusToStartOf(nextText)

  if (!isInVoid && !isNextInVoid && focusBlock.hasNode(nextText.key)) {
    change.moveFocus(1)
  }
}

/**
 * Mix in move methods.
 */

const MOVE_DIRECTIONS = ['Forward', 'Backward']

MOVE_DIRECTIONS.forEach(direction => {
  const anchor = `moveAnchorChar${direction}`
  const focus = `moveFocusChar${direction}`

  Changes[`moveChar${direction}`] = change => {
    change[anchor]()[focus]()
  }

  Changes[`moveStartChar${direction}`] = change => {
    if (change.value.isBackward) {
      change[focus]()
    } else {
      change[anchor]()
    }
  }

  Changes[`moveEndChar${direction}`] = change => {
    if (change.value.isBackward) {
      change[anchor]()
    } else {
      change[focus]()
    }
  }

  Changes[`extendChar${direction}`] = change => {
    change[`moveFocusChar${direction}`]()
  }

  Changes[`collapseChar${direction}`] = change => {
    const collapse =
      direction == 'Forward' ? 'collapseToEnd' : 'collapseToStart'
    change[collapse]()[`moveChar${direction}`]()
  }
})

/**
 * Mix in alias methods.
 */

const ALIAS_METHODS = [
  ['collapseLineBackward', 'collapseToStartOfBlock'],
  ['collapseLineForward', 'collapseToEndOfBlock'],
  ['extendLineBackward', 'extendToStartOfBlock'],
  ['extendLineForward', 'extendToEndOfBlock'],
]

ALIAS_METHODS.forEach(([alias, method]) => {
  Changes[alias] = function(change, ...args) {
    change[method](change, ...args)
  }
})

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

const PROXY_TRANSFORMS = [
  'blur',
  'collapseTo',
  'collapseToAnchor',
  'collapseToEnd',
  'collapseToEndOf',
  'collapseToFocus',
  'collapseToStart',
  'collapseToStartOf',
  'extend',
  'extendTo',
  'extendToEndOf',
  'extendToStartOf',
  'flip',
  'focus',
  'move',
  'moveAnchor',
  'moveAnchorOffsetTo',
  'moveAnchorTo',
  'moveAnchorToEndOf',
  'moveAnchorToStartOf',
  'moveEnd',
  'moveEndOffsetTo',
  'moveEndTo',
  'moveFocus',
  'moveFocusOffsetTo',
  'moveFocusTo',
  'moveFocusToEndOf',
  'moveFocusToStartOf',
  'moveOffsetsTo',
  'moveStart',
  'moveStartOffsetTo',
  'moveStartTo',
  'moveTo',
  'moveToEnd',
  'moveToEndOf',
  'moveToRangeOf',
  'moveToStart',
  'moveToStartOf',
  'deselect',
]

PROXY_TRANSFORMS.forEach(method => {
  Changes[method] = (change, ...args) => {
    const normalize = method != 'deselect'
    const { value } = change
    const { document, selection } = value
    let next = selection[method](...args)
    if (normalize) next = next.normalize(document)
    change.select(next)
  }
})

/**
 * Mix in node-related changes.
 */

const PREFIXES = [
  'moveTo',
  'moveAnchorTo',
  'moveFocusTo',
  'moveStartTo',
  'moveEndTo',
  'collapseTo',
  'extendTo',
]

const DIRECTIONS = ['Next', 'Previous']

const OBJECTS = ['Block', 'Inline', 'Text']

PREFIXES.forEach(prefix => {
  const edges = ['Start', 'End']

  if (prefix == 'moveTo') {
    edges.push('Range')
  }

  edges.forEach(edge => {
    const method = `${prefix}${edge}Of`

    OBJECTS.forEach(object => {
      const getNode = object == 'Text' ? 'getNode' : `getClosest${object}`

      Changes[`${method}${object}`] = change => {
        const { value } = change
        const { document, selection } = value
        const node = document[getNode](selection.startKey)
        if (!node) return
        change[method](node)
      }

      DIRECTIONS.forEach(direction => {
        const getDirectionNode = `get${direction}${object}`
        const directionKey = direction == 'Next' ? 'startKey' : 'endKey'

        Changes[`${method}${direction}${object}`] = change => {
          const { value } = change
          const { document, selection } = value
          const node = document[getNode](selection[directionKey])
          if (!node) return
          const target = document[getDirectionNode](node.key)
          if (!target) return
          change[method](target)
        }
      })
    })
  })
})

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
