import { is } from 'immutable'
import pick from 'lodash/pick'

import Selection from '../models/selection'

const Changes = {}

Changes.blur = change => {
  change.select({ isFocused: false })
}

Changes.deselect = change => {
  const range = Selection.create()
  change.select(range)
}

Changes.focus = change => {
  change.select({ isFocused: true })
}

Changes.flip = change => {
  change.call(proxy, 'flip')
}

Changes.moveAnchorBackward = (change, ...args) => {
  change.call(pointBackward, 'anchor', ...args)
}

Changes.moveAnchorForward = (change, ...args) => {
  change.call(pointForward, 'anchor', ...args)
}

Changes.moveAnchorTo = (change, ...args) => {
  change.call(proxy, 'moveAnchorTo', ...args)
}

Changes.moveAnchorToEndOfBlock = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'block')
}

Changes.moveAnchorToEndOfInline = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'inline')
}

Changes.moveAnchorToEndOfDocument = change => {
  change.moveAnchorToEndOfNode(change.value.document).moveToAnchor()
}

Changes.moveAnchorToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'block')
}

Changes.moveAnchorToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'inline')
}

Changes.moveAnchorToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'text')
}

Changes.moveAnchorToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveAnchorToEndOfNode', ...args)
}

Changes.moveAnchorToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'block')
}

Changes.moveAnchorToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'inline')
}

Changes.moveAnchorToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'text')
}

Changes.moveAnchorToEndOfText = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'text')
}

Changes.moveAnchorToStartOfBlock = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'block')
}

Changes.moveAnchorToStartOfDocument = change => {
  change.moveAnchorToStartOfNode(change.value.document).moveToAnchor()
}

Changes.moveAnchorToStartOfInline = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'inline')
}

Changes.moveAnchorToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'block')
}

Changes.moveAnchorToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'inline')
}

Changes.moveAnchorToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'text')
}

Changes.moveAnchorToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveAnchorToStartOfNode', ...args)
}

Changes.moveAnchorToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'block')
}

Changes.moveAnchorToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'inline')
}

Changes.moveAnchorToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'text')
}

Changes.moveAnchorToStartOfText = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'text')
}

Changes.moveBackward = (change, ...args) => {
  change.moveAnchorBackward(...args).moveFocusBackward(...args)
}

Changes.moveEndBackward = (change, ...args) => {
  change.call(pointBackward, 'end', ...args)
}

Changes.moveEndForward = (change, ...args) => {
  change.call(pointForward, 'end', ...args)
}

Changes.moveEndTo = (change, ...args) => {
  change.call(proxy, 'moveEndTo', ...args)
}

Changes.moveEndToEndOfBlock = change => {
  change.call(pointEdgeObject, 'end', 'end', 'block')
}

Changes.moveEndToEndOfDocument = change => {
  change.moveEndToEndOfNode(change.value.document).moveToEnd()
}

Changes.moveEndToEndOfInline = change => {
  change.call(pointEdgeObject, 'end', 'end', 'inline')
}

Changes.moveEndToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'block')
}

Changes.moveEndToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'inline')
}

Changes.moveEndToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'text')
}

Changes.moveEndToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveEndToEndOfNode', ...args)
}

Changes.moveEndToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'block')
}

Changes.moveEndToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'inline')
}

Changes.moveEndToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'text')
}

Changes.moveEndToEndOfText = change => {
  change.call(pointEdgeObject, 'end', 'end', 'text')
}

Changes.moveEndToStartOfBlock = change => {
  change.call(pointEdgeObject, 'end', 'start', 'block')
}

Changes.moveEndToStartOfDocument = change => {
  change.moveEndToStartOfNode(change.value.document).moveToEnd()
}

Changes.moveEndToStartOfInline = change => {
  change.call(pointEdgeObject, 'end', 'start', 'inline')
}

Changes.moveEndToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'block')
}

Changes.moveEndToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'inline')
}

Changes.moveEndToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'text')
}

Changes.moveEndToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveEndToStartOfNode', ...args)
}

Changes.moveEndToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'block')
}

Changes.moveEndToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'inline')
}

Changes.moveEndToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'text')
}

Changes.moveEndToStartOfText = change => {
  change.call(pointEdgeObject, 'end', 'start', 'text')
}

Changes.moveFocusBackward = (change, ...args) => {
  change.call(pointBackward, 'focus', ...args)
}

Changes.moveFocusForward = (change, ...args) => {
  change.call(pointForward, 'focus', ...args)
}

Changes.moveFocusTo = (change, ...args) => {
  change.call(proxy, 'moveFocusTo', ...args)
}

Changes.moveFocusToEndOfBlock = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'block')
}

Changes.moveFocusToEndOfDocument = change => {
  change.moveFocusToEndOfNode(change.value.document).moveToFocus()
}

Changes.moveFocusToEndOfInline = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'inline')
}

Changes.moveFocusToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'block')
}

Changes.moveFocusToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'inline')
}

Changes.moveFocusToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'text')
}

Changes.moveFocusToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveFocusToEndOfNode', ...args)
}

Changes.moveFocusToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'block')
}

Changes.moveFocusToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'inline')
}

Changes.moveFocusToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'text')
}

Changes.moveFocusToEndOfText = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'text')
}

Changes.moveFocusToStartOfBlock = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'block')
}

Changes.moveFocusToStartOfDocument = change => {
  change.moveFocusToStartOfNode(change.value.document).moveToFocus()
}

Changes.moveFocusToStartOfInline = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'inline')
}

Changes.moveFocusToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'block')
}

Changes.moveFocusToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'inline')
}

Changes.moveFocusToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'text')
}

Changes.moveFocusToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveFocusToStartOfNode', ...args)
}

Changes.moveFocusToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'block')
}

Changes.moveFocusToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'inline')
}

Changes.moveFocusToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'text')
}

Changes.moveFocusToStartOfText = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'text')
}

Changes.moveForward = (change, ...args) => {
  change.moveAnchorForward(...args).moveFocusForward(...args)
}

Changes.moveStartBackward = (change, ...args) => {
  change.call(pointBackward, 'start', ...args)
}

Changes.moveStartForward = (change, ...args) => {
  change.call(pointForward, 'start', ...args)
}

Changes.moveStartTo = (change, ...args) => {
  change.call(proxy, 'moveStartTo', ...args)
}

Changes.moveStartToEndOfBlock = change => {
  change.call(pointEdgeObject, 'start', 'end', 'block')
}

Changes.moveStartToEndOfDocument = change => {
  change.moveStartToEndOfNode(change.value.document).moveToStart()
}

Changes.moveStartToEndOfInline = change => {
  change.call(pointEdgeObject, 'start', 'end', 'inline')
}

Changes.moveStartToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'block')
}

Changes.moveStartToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'inline')
}

Changes.moveStartToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'text')
}

Changes.moveStartToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveStartToEndOfNode', ...args)
}

Changes.moveStartToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'block')
}

Changes.moveStartToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'inline')
}

Changes.moveStartToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'text')
}

Changes.moveStartToEndOfText = change => {
  change.call(pointEdgeObject, 'start', 'end', 'text')
}

Changes.moveStartToStartOfBlock = change => {
  change.call(pointEdgeObject, 'start', 'start', 'block')
}

Changes.moveStartToStartOfDocument = change => {
  change.moveStartToStartOfNode(change.value.document).moveToStart()
}

Changes.moveStartToStartOfInline = change => {
  change.call(pointEdgeObject, 'start', 'start', 'inline')
}

Changes.moveStartToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'block')
}

Changes.moveStartToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'inline')
}

Changes.moveStartToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'text')
}

Changes.moveStartToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveStartToStartOfNode', ...args)
}

Changes.moveStartToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'block')
}

Changes.moveStartToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'inline')
}

Changes.moveStartToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'text')
}

Changes.moveStartToStartOfText = change => {
  change.call(pointEdgeObject, 'start', 'start', 'text')
}

Changes.moveTo = (change, ...args) => {
  change.call(proxy, 'moveTo', ...args)
}

Changes.moveToAnchor = change => {
  change.call(proxy, 'moveToAnchor')
}

Changes.moveToEnd = change => {
  change.call(proxy, 'moveToEnd')
}

Changes.moveToEndOfBlock = change => {
  change.moveEndToEndOfBlock().moveToEnd()
}

Changes.moveToEndOfDocument = change => {
  change.moveEndToEndOfNode(change.value.document).moveToEnd()
}

Changes.moveToEndOfInline = change => {
  change.moveEndToEndOfInline().moveToEnd()
}

Changes.moveToEndOfNextBlock = change => {
  change.moveEndToEndOfNextBlock().moveToEnd()
}

Changes.moveToEndOfNextInline = change => {
  change.moveEndToEndOfNextInline().moveToEnd()
}

Changes.moveToEndOfNextText = change => {
  change.moveEndToEndOfNextText().moveToEnd()
}

Changes.moveToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveToEndOfNode', ...args)
}

Changes.moveToEndOfPreviousBlock = change => {
  change.moveStartToEndOfPreviousBlock().moveToStart()
}

Changes.moveToEndOfPreviousInline = change => {
  change.moveStartToEndOfPreviousInline().moveToStart()
}

Changes.moveToEndOfPreviousText = change => {
  change.moveStartToEndOfPreviousText().moveToStart()
}

Changes.moveToEndOfText = change => {
  change.moveEndToEndOfText().moveToEnd()
}

Changes.moveToFocus = change => {
  change.call(proxy, 'moveToFocus')
}

Changes.moveToRangeOfDocument = change => {
  change.moveToRangeOfNode(change.value.document)
}

Changes.moveToRangeOfNode = (change, ...args) => {
  change.call(proxy, 'moveToRangeOfNode', ...args)
}

Changes.moveToStart = change => {
  change.call(proxy, 'moveToStart')
}

Changes.moveToStartOfBlock = change => {
  change.moveStartToStartOfBlock().moveToStart()
}

Changes.moveToStartOfDocument = change => {
  change.moveStartToStartOfNode(change.value.document).moveToStart()
}

Changes.moveToStartOfInline = change => {
  change.moveStartToStartOfInline().moveToStart()
}

Changes.moveToStartOfNextBlock = change => {
  change.moveEndToStartOfNextBlock().moveToEnd()
}

Changes.moveToStartOfNextInline = change => {
  change.moveEndToStartOfNextInline().moveToEnd()
}

Changes.moveToStartOfNextText = change => {
  change.moveEndToStartOfNextText().moveToEnd()
}

Changes.moveToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveToStartOfNode', ...args)
}

Changes.moveToStartOfPreviousBlock = change => {
  change.moveStartToStartOfPreviousBlock().moveToStart()
}

Changes.moveToStartOfPreviousInline = change => {
  change.moveStartToStartOfPreviousInline().moveToStart()
}

Changes.moveToStartOfPreviousText = change => {
  change.moveStartToStartOfPreviousText().moveToStart()
}

Changes.moveToStartOfText = change => {
  change.moveStartToStartOfText().moveToStart()
}

Changes.select = (change, properties, options = {}) => {
  properties = Selection.createProperties(properties)
  const { snapshot = false } = options
  const { value } = change
  const { document, selection } = value
  const props = {}
  let next = selection.setProperties(properties)
  next = document.resolveSelection(next)

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
  if (selection.marks && !props.marks && (props.anchor || props.focus)) {
    props.marks = null
  }

  // If there are no new properties to set, abort to avoid extra operations.
  if (Object.keys(props).length === 0) {
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

Changes.setAnchor = (change, ...args) => {
  change.call(proxy, 'setAnchor', ...args)
}

Changes.setEnd = (change, ...args) => {
  change.call(proxy, 'setEnd', ...args)
}

Changes.setFocus = (change, ...args) => {
  change.call(proxy, 'setFocus', ...args)
}

Changes.setStart = (change, ...args) => {
  change.call(proxy, 'setStart', ...args)
}

Changes.snapshotSelection = change => {
  change.withoutMerging(c =>
    c.select(change.value.selection, { snapshot: true })
  )
}

/**
 * Helpers.
 */

function proxy(change, method, ...args) {
  const range = change.value.selection[method](...args)
  change.select(range)
}

function pointEdgeObject(change, point, edge, object) {
  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const Edge = edge.slice(0, 1).toUpperCase() + edge.slice(1)
  const Object = object.slice(0, 1).toUpperCase() + object.slice(1)
  const method = `move${Point}To${Edge}OfNode`
  const getNode = object == 'text' ? 'getNode' : `getClosest${Object}`
  const { value } = change
  const { document, selection } = value
  const p = selection[point]
  const node = document[getNode](p.key)
  if (!node) return
  change[method](node)
}

function pointEdgeSideObject(change, point, edge, side, object) {
  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const Edge = edge.slice(0, 1).toUpperCase() + edge.slice(1)
  const Side = side.slice(0, 1).toUpperCase() + side.slice(1)
  const Object = object.slice(0, 1).toUpperCase() + object.slice(1)
  const method = `move${Point}To${Edge}OfNode`
  const getNode = object == 'text' ? 'getNode' : `getClosest${Object}`
  const getDirectionNode = `get${Side}${Object}`
  const { value } = change
  const { document, selection } = value
  const p = selection[point]
  const node = document[getNode](p.key)
  if (!node) return
  const target = document[getDirectionNode](node.key)
  if (!target) return
  change[method](target)
}

function pointBackward(change, point, n = 1) {
  if (n === 0) return
  if (n < 0) return pointForward(change, point, -n)

  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const { value } = change
  const { document, selection, schema } = value
  const p = selection[point]
  const hasVoidParent = document.hasVoidParent(p.path, schema)

  // what is this?
  if (!hasVoidParent && p.offset - n >= 0) {
    const range = selection[`move${Point}Backward`](n)
    change.select(range)
    return
  }

  const previous = document.getPreviousText(p.path)
  if (!previous) return

  const block = document.getClosestBlock(p.path)
  const isInBlock = block.hasNode(previous.key)
  const isPreviousInVoid =
    previous && document.hasVoidParent(previous.key, schema)
  change[`move${Point}ToEndOfNode`](previous)

  // when is this called?
  if (!hasVoidParent && !isPreviousInVoid && isInBlock) {
    const range = change.value.selection[`move${Point}Backward`](n)
    change.select(range)
  }
}

function pointForward(change, point, n = 1) {
  if (n === 0) return
  if (n < 0) return pointBackward(change, point, -n)

  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const { value } = change
  const { document, selection, schema } = value
  const p = selection[point]
  const text = document.getNode(p.path)
  const hasVoidParent = document.hasVoidParent(p.path, schema)

  // what is this?
  if (!hasVoidParent && p.offset + n <= text.text.length) {
    const range = selection[`move${Point}Forward`](n)
    change.select(range)
    return
  }

  const next = document.getNextText(p.path)
  if (!next) return

  const block = document.getClosestBlock(p.path)
  const isInBlock = block.hasNode(next.key)
  const isNextInVoid = document.hasVoidParent(next.key, schema)
  change[`move${Point}ToStartOfNode`](next)

  // when is this called?
  if (!hasVoidParent && !isNextInVoid && isInBlock) {
    const range = change.value.selection[`move${Point}Forward`](n)
    change.select(range)
  }
}

export default Changes
