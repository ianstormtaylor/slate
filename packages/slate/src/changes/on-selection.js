
import isEmpty from 'is-empty'
import logger from 'slate-dev-logger'
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
  const sel = selection.toJSON()
  const next = selection.merge(properties).normalize(document)
  properties = pick(next, Object.keys(properties))

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue
    props[k] = properties[k]
  }

  // Resolve the selection keys into paths.
  sel.anchorPath = sel.anchorKey == null ? null : document.getPath(sel.anchorKey)
  delete sel.anchorKey

  if (props.anchorKey) {
    props.anchorPath = props.anchorKey == null ? null : document.getPath(props.anchorKey)
    delete props.anchorKey
  }

  sel.focusPath = sel.focusKey == null ? null : document.getPath(sel.focusKey)
  delete sel.focusKey

  if (props.focusKey) {
    props.focusPath = props.focusKey == null ? null : document.getPath(props.focusKey)
    delete props.focusKey
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  const moved = [
    'anchorPath',
    'anchorOffset',
    'focusPath',
    'focusOffset',
  ].some(p => props.hasOwnProperty(p))

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null
  }

  // If there are no new properties to set, abort.
  if (isEmpty(props)) {
    return
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    properties: props,
    selection: sel,
  }, snapshot ? { skip: false, merge: false } : {})
}

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes.selectAll = (change) => {
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

Changes.snapshotSelection = (change) => {
  const { value } = change
  const { selection } = value
  change.select(selection, { snapshot: true })
}

/**
 * Move the anchor point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes.moveAnchorCharBackward = (change) => {
  const { value } = change
  const { document, selection, anchorText, anchorBlock } = value
  const { anchorOffset } = selection
  const previousText = document.getPreviousText(anchorText.key)
  const isInVoid = document.hasVoidParent(anchorText.key)
  const isPreviousInVoid = previousText && document.hasVoidParent(previousText.key)

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

Changes.moveAnchorCharForward = (change) => {
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

Changes.moveFocusCharBackward = (change) => {
  const { value } = change
  const { document, selection, focusText, focusBlock } = value
  const { focusOffset } = selection
  const previousText = document.getPreviousText(focusText.key)
  const isInVoid = document.hasVoidParent(focusText.key)
  const isPreviousInVoid = previousText && document.hasVoidParent(previousText.key)

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

Changes.moveFocusCharForward = (change) => {
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

const MOVE_DIRECTIONS = [
  'Forward',
  'Backward',
]

MOVE_DIRECTIONS.forEach((direction) => {
  const anchor = `moveAnchorChar${direction}`
  const focus = `moveFocusChar${direction}`

  Changes[`moveChar${direction}`] = (change) => {
    change[anchor]()[focus]()
  }

  Changes[`moveStartChar${direction}`] = (change) => {
    if (change.value.isBackward) {
      change[focus]()
    } else {
      change[anchor]()
    }
  }

  Changes[`moveEndChar${direction}`] = (change) => {
    if (change.value.isBackward) {
      change[anchor]()
    } else {
      change[focus]()
    }
  }

  Changes[`extendChar${direction}`] = (change) => {
    change[`moveFocusChar${direction}`]()
  }

  Changes[`collapseChar${direction}`] = (change) => {
    const collapse = direction == 'Forward' ? 'collapseToEnd' : 'collapseToStart'
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

ALIAS_METHODS.forEach(([ alias, method ]) => {
  Changes[alias] = function (change, ...args) {
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
  // 'moveTo', Commented out for now, since it conflicts with a deprecated one.
  'moveToEnd',
  'moveToEndOf',
  'moveToRangeOf',
  'moveToStart',
  'moveToStartOf',
  'deselect',
]

PROXY_TRANSFORMS.forEach((method) => {
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

const DIRECTIONS = [
  'Next',
  'Previous',
]

const KINDS = [
  'Block',
  'Inline',
  'Text',
]

PREFIXES.forEach((prefix) => {
  const edges = [
    'Start',
    'End',
  ]

  if (prefix == 'moveTo') {
    edges.push('Range')
  }

  edges.forEach((edge) => {
    const method = `${prefix}${edge}Of`

    KINDS.forEach((kind) => {
      const getNode = kind == 'Text' ? 'getNode' : `getClosest${kind}`

      Changes[`${method}${kind}`] = (change) => {
        const { value } = change
        const { document, selection } = value
        const node = document[getNode](selection.startKey)
        if (!node) return
        change[method](node)
      }

      DIRECTIONS.forEach((direction) => {
        const getDirectionNode = `get${direction}${kind}`
        const directionKey = direction == 'Next' ? 'startKey' : 'endKey'

        Changes[`${method}${direction}${kind}`] = (change) => {
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
 * Set `properties` on the selection.
 *
 * @param {Mixed} ...args
 * @param {Change} change
 */

Changes.moveTo = (change, properties) => {
  logger.deprecate('0.17.0', 'The `moveTo()` change is deprecated, please use `select()` instead.')
  change.select(properties)
}

/**
 * Unset the selection's marks.
 *
 * @param {Change} change
 */

Changes.unsetMarks = (change) => {
  logger.deprecate('0.17.0', 'The `unsetMarks()` change is deprecated.')
  change.select({ marks: null })
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Change} change
 */

Changes.unsetSelection = (change) => {
  logger.deprecate('0.17.0', 'The `unsetSelection()` change is deprecated, please use `deselect()` instead.')
  change.select({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  })
}

/**
 * Mix in deprecated changes with a warning.
 */

const DEPRECATED_TRANSFORMS = [
  ['extendBackward', 'extend', 'The `extendBackward(n)` change is deprecated, please use `extend(n)` instead with a negative offset.'],
  ['extendForward', 'extend', 'The `extendForward(n)` change is deprecated, please use `extend(n)` instead.'],
  ['moveBackward', 'move', 'The `moveBackward(n)` change is deprecated, please use `move(n)` instead with a negative offset.'],
  ['moveForward', 'move', 'The `moveForward(n)` change is deprecated, please use `move(n)` instead.'],
  ['moveStartOffset', 'moveStart', 'The `moveStartOffset(n)` change is deprecated, please use `moveStart(n)` instead.'],
  ['moveEndOffset', 'moveEnd', 'The `moveEndOffset(n)` change is deprecated, please use `moveEnd()` instead.'],
  ['moveToOffsets', 'moveOffsetsTo', 'The `moveToOffsets()` change is deprecated, please use `moveOffsetsTo()` instead.'],
  ['flipSelection', 'flip', 'The `flipSelection()` change is deprecated, please use `flip()` instead.'],
]

DEPRECATED_TRANSFORMS.forEach(([ old, current, warning ]) => {
  Changes[old] = (change, ...args) => {
    logger.deprecate('0.17.0', warning)
    const { value } = change
    const { document, selection } = value
    const sel = selection[current](...args).normalize(document)
    change.select(sel)
  }
})

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
