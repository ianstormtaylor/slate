
import Normalize from '../utils/normalize'
import pick from 'lodash/pick'
import warn from '../utils/warn'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Set `properties` on the selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.select = (transform, properties, options = {}) => {
  properties = Normalize.selectionProperties(properties)

  const { state } = transform
  const { document, selection } = state
  const props = {}
  const sel = selection.toJSON()
  const next = selection.merge(properties).normalize(document)
  properties = pick(next, Object.keys(properties))

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (!options.snapshot && properties[k] == sel[k]) continue
    props[k] = properties[k]
  }

  // Resolve the selection keys into paths.
  sel.anchorPath = document.getPath(sel.anchorKey)
  delete sel.anchorKey

  if (props.anchorKey) {
    props.anchorPath = document.getPath(props.anchorKey)
    delete props.anchorKey
  }

  sel.focusPath = document.getPath(sel.focusKey)
  delete sel.focusKey

  if (props.focusKey) {
    props.focusPath = document.getPath(props.focusKey)
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

  // Apply the operation.
  transform.applyOperation({
    type: 'set_selection',
    properties: props,
    selection: sel,
  })
}

/**
 * Selects the whole selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.selectAll = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const next = selection.moveToRangeOf(document)
  transform.select(next)
}

/**
 * Snapshot the current selection.
 *
 * @param {Transform} transform
 */

Transforms.snapshotSelection = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.select(selection, { snapshot: true })
}

/**
 * Set `properties` on the selection.
 *
 * @param {Mixed} ...args
 * @param {Transform} transform
 */

Transforms.moveTo = (transform, properties) => {
  warn('The `moveTo()` transform is deprecated, please use `select()` instead.')
  transform.select(properties)
}

/**
 * Unset the selection's marks.
 *
 * @param {Transform} transform
 */

Transforms.unsetMarks = (transform) => {
  warn('The `unsetMarks()` transform is deprecated.')
  transform.select({ marks: null })
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 */

Transforms.unsetSelection = (transform) => {
  warn('The `unsetSelection()` transform is deprecated, please use `deselect()` instead.')
  transform.select({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  })
}

/**
 * Mix in selection transforms that are just a proxy for the selection method.
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
  Transforms[method] = (transform, ...args) => {
    const normalize = method != 'deselect'
    const { state } = transform
    const { document, selection } = state
    let next = selection[method](...args)
    if (normalize) next = next.normalize(document)
    transform.select(next)
  }
})

/**
 * Mix in node-related transforms.
 */

const PREFIXES = [
  'moveTo',
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
    DIRECTIONS.forEach((direction) => {
      KINDS.forEach((kind) => {
        const get = `get${direction}${kind}`
        const getAtRange = `get${kind}sAtRange`
        const index = direction == 'Next' ? 'last' : 'first'
        const method = `${prefix}${edge}Of`
        const name = `${method}${direction}${kind}`

        Transforms[name] = (transform) => {
          const { state } = transform
          const { document, selection } = state
          const nodes = document[getAtRange](selection)
          const node = nodes[index]()
          const target = document[get](node.key)
          if (!target) return
          const next = selection[method](target)
          transform.select(next)
        }
      })
    })
  })
})

/**
 * Mix in deprecated transforms with a warning.
 */

const DEPRECATED_TRANSFORMS = [
  ['extendBackward', 'extend', 'The `extendBackward(n)` transform is deprecated, please use `extend(n)` instead with a negative offset.'],
  ['extendForward', 'extend', 'The `extendForward(n)` transform is deprecated, please use `extend(n)` instead.'],
  ['moveBackward', 'move', 'The `moveBackward(n)` transform is deprecated, please use `move(n)` instead with a negative offset.'],
  ['moveForward', 'move', 'The `moveForward(n)` transform is deprecated, please use `move(n)` instead.'],
  ['moveStartOffset', 'moveStart', 'The `moveStartOffset(n)` transform is deprecated, please use `moveStart(n)` instead.'],
  ['moveEndOffset', 'moveEnd', 'The `moveEndOffset(n)` transform is deprecated, please use `moveEnd()` instead.'],
  ['moveToOffsets', 'moveOffsetsTo', 'The `moveToOffsets()` transform is deprecated, please use `moveOffsetsTo()` instead.'],
  ['flipSelection', 'flip', 'The `flipSelection()` transform is deprecated, please use `flip()` instead.'],
]

DEPRECATED_TRANSFORMS.forEach(([ old, current, warning ]) => {
  Transforms[old] = (transform, ...args) => {
    warn(warning)
    const { state } = transform
    const { document, selection } = state
    const sel = selection[current](...args).normalize(document)
    transform.select(sel)
  }
})

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
