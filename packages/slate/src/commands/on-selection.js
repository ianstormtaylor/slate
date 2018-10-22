import { is } from 'immutable'
import pick from 'lodash/pick'

import Selection from '../models/selection'
import TextUtils from '../utils/text-utils'

const Commands = {}

Commands.blur = change => {
  change.select({ isFocused: false })
}

Commands.deselect = change => {
  const range = Selection.create()
  change.select(range)
}

Commands.focus = change => {
  change.select({ isFocused: true })
}

Commands.flip = change => {
  change.call(proxy, 'flip')
}

Commands.moveAnchorBackward = (change, ...args) => {
  change.call(pointBackward, 'anchor', ...args)
}

Commands.moveAnchorWordBackward = (change, ...args) => {
  change.call(pointWordBackward, 'anchor', ...args)
}

Commands.moveAnchorForward = (change, ...args) => {
  change.call(pointForward, 'anchor', ...args)
}

Commands.moveAnchorWordForward = (change, ...args) => {
  change.call(pointWordForward, 'anchor', ...args)
}

Commands.moveAnchorTo = (change, ...args) => {
  change.call(proxy, 'moveAnchorTo', ...args)
}

Commands.moveAnchorToEndOfBlock = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'block')
}

Commands.moveAnchorToEndOfInline = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'inline')
}

Commands.moveAnchorToEndOfDocument = change => {
  change.moveAnchorToEndOfNode(change.value.document).moveToAnchor()
}

Commands.moveAnchorToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'block')
}

Commands.moveAnchorToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'inline')
}

Commands.moveAnchorToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'next', 'text')
}

Commands.moveAnchorToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveAnchorToEndOfNode', ...args)
}

Commands.moveAnchorToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'block')
}

Commands.moveAnchorToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'inline')
}

Commands.moveAnchorToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'end', 'previous', 'text')
}

Commands.moveAnchorToEndOfText = change => {
  change.call(pointEdgeObject, 'anchor', 'end', 'text')
}

Commands.moveAnchorToStartOfBlock = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'block')
}

Commands.moveAnchorToStartOfDocument = change => {
  change.moveAnchorToStartOfNode(change.value.document).moveToAnchor()
}

Commands.moveAnchorToStartOfInline = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'inline')
}

Commands.moveAnchorToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'block')
}

Commands.moveAnchorToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'inline')
}

Commands.moveAnchorToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'next', 'text')
}

Commands.moveAnchorToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveAnchorToStartOfNode', ...args)
}

Commands.moveAnchorToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'block')
}

Commands.moveAnchorToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'inline')
}

Commands.moveAnchorToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'anchor', 'start', 'previous', 'text')
}

Commands.moveAnchorToStartOfText = change => {
  change.call(pointEdgeObject, 'anchor', 'start', 'text')
}

Commands.moveBackward = (change, ...args) => {
  change.moveAnchorBackward(...args).moveFocusBackward(...args)
}

Commands.moveWordBackward = (change, ...args) => {
  change.moveFocusWordBackward(...args).moveToFocus()
}

Commands.moveEndBackward = (change, ...args) => {
  change.call(pointBackward, 'end', ...args)
}

Commands.moveEndWordBackward = (change, ...args) => {
  change.call(pointWordBackward, 'end', ...args)
}

Commands.moveEndForward = (change, ...args) => {
  change.call(pointForward, 'end', ...args)
}

Commands.moveEndWordForward = (change, ...args) => {
  change.call(pointWordForward, 'end', ...args)
}

Commands.moveEndTo = (change, ...args) => {
  change.call(proxy, 'moveEndTo', ...args)
}

Commands.moveEndToEndOfBlock = change => {
  change.call(pointEdgeObject, 'end', 'end', 'block')
}

Commands.moveEndToEndOfDocument = change => {
  change.moveEndToEndOfNode(change.value.document).moveToEnd()
}

Commands.moveEndToEndOfInline = change => {
  change.call(pointEdgeObject, 'end', 'end', 'inline')
}

Commands.moveEndToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'block')
}

Commands.moveEndToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'inline')
}

Commands.moveEndToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'next', 'text')
}

Commands.moveEndToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveEndToEndOfNode', ...args)
}

Commands.moveEndToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'block')
}

Commands.moveEndToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'inline')
}

Commands.moveEndToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'end', 'end', 'previous', 'text')
}

Commands.moveEndToEndOfText = change => {
  change.call(pointEdgeObject, 'end', 'end', 'text')
}

Commands.moveEndToStartOfBlock = change => {
  change.call(pointEdgeObject, 'end', 'start', 'block')
}

Commands.moveEndToStartOfDocument = change => {
  change.moveEndToStartOfNode(change.value.document).moveToEnd()
}

Commands.moveEndToStartOfInline = change => {
  change.call(pointEdgeObject, 'end', 'start', 'inline')
}

Commands.moveEndToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'block')
}

Commands.moveEndToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'inline')
}

Commands.moveEndToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'next', 'text')
}

Commands.moveEndToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveEndToStartOfNode', ...args)
}

Commands.moveEndToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'block')
}

Commands.moveEndToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'inline')
}

Commands.moveEndToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'end', 'start', 'previous', 'text')
}

Commands.moveEndToStartOfText = change => {
  change.call(pointEdgeObject, 'end', 'start', 'text')
}

Commands.moveFocusBackward = (change, ...args) => {
  change.call(pointBackward, 'focus', ...args)
}

Commands.moveFocusWordBackward = (change, ...args) => {
  change.call(pointWordBackward, 'focus', ...args)
}

Commands.moveFocusForward = (change, ...args) => {
  change.call(pointForward, 'focus', ...args)
}

Commands.moveFocusWordForward = (change, ...args) => {
  change.call(pointWordForward, 'focus', ...args)
}

Commands.moveFocusTo = (change, ...args) => {
  change.call(proxy, 'moveFocusTo', ...args)
}

Commands.moveFocusToEndOfBlock = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'block')
}

Commands.moveFocusToEndOfDocument = change => {
  change.moveFocusToEndOfNode(change.value.document).moveToFocus()
}

Commands.moveFocusToEndOfInline = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'inline')
}

Commands.moveFocusToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'block')
}

Commands.moveFocusToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'inline')
}

Commands.moveFocusToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'next', 'text')
}

Commands.moveFocusToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveFocusToEndOfNode', ...args)
}

Commands.moveFocusToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'block')
}

Commands.moveFocusToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'inline')
}

Commands.moveFocusToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'focus', 'end', 'previous', 'text')
}

Commands.moveFocusToEndOfText = change => {
  change.call(pointEdgeObject, 'focus', 'end', 'text')
}

Commands.moveFocusToStartOfBlock = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'block')
}

Commands.moveFocusToStartOfDocument = change => {
  change.moveFocusToStartOfNode(change.value.document).moveToFocus()
}

Commands.moveFocusToStartOfInline = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'inline')
}

Commands.moveFocusToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'block')
}

Commands.moveFocusToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'inline')
}

Commands.moveFocusToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'next', 'text')
}

Commands.moveFocusToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveFocusToStartOfNode', ...args)
}

Commands.moveFocusToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'block')
}

Commands.moveFocusToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'inline')
}

Commands.moveFocusToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'focus', 'start', 'previous', 'text')
}

Commands.moveFocusToStartOfText = change => {
  change.call(pointEdgeObject, 'focus', 'start', 'text')
}

Commands.moveForward = (change, ...args) => {
  change.moveAnchorForward(...args).moveFocusForward(...args)
}

Commands.moveWordForward = (change, ...args) => {
  change.moveFocusWordForward(...args).moveToFocus(...args)
}

Commands.moveStartBackward = (change, ...args) => {
  change.call(pointBackward, 'start', ...args)
}

Commands.moveStartWordBackward = (change, ...args) => {
  change.call(pointWordBackward, 'start', ...args)
}

Commands.moveStartForward = (change, ...args) => {
  change.call(pointForward, 'start', ...args)
}

Commands.moveStartWordForward = (change, ...args) => {
  change.call(pointWordForward, 'start', ...args)
}

Commands.moveStartTo = (change, ...args) => {
  change.call(proxy, 'moveStartTo', ...args)
}

Commands.moveStartToEndOfBlock = change => {
  change.call(pointEdgeObject, 'start', 'end', 'block')
}

Commands.moveStartToEndOfDocument = change => {
  change.moveStartToEndOfNode(change.value.document).moveToStart()
}

Commands.moveStartToEndOfInline = change => {
  change.call(pointEdgeObject, 'start', 'end', 'inline')
}

Commands.moveStartToEndOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'block')
}

Commands.moveStartToEndOfNextInline = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'inline')
}

Commands.moveStartToEndOfNextText = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'next', 'text')
}

Commands.moveStartToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveStartToEndOfNode', ...args)
}

Commands.moveStartToEndOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'block')
}

Commands.moveStartToEndOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'inline')
}

Commands.moveStartToEndOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'start', 'end', 'previous', 'text')
}

Commands.moveStartToEndOfText = change => {
  change.call(pointEdgeObject, 'start', 'end', 'text')
}

Commands.moveStartToStartOfBlock = change => {
  change.call(pointEdgeObject, 'start', 'start', 'block')
}

Commands.moveStartToStartOfDocument = change => {
  change.moveStartToStartOfNode(change.value.document).moveToStart()
}

Commands.moveStartToStartOfInline = change => {
  change.call(pointEdgeObject, 'start', 'start', 'inline')
}

Commands.moveStartToStartOfNextBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'block')
}

Commands.moveStartToStartOfNextInline = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'inline')
}

Commands.moveStartToStartOfNextText = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'next', 'text')
}

Commands.moveStartToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveStartToStartOfNode', ...args)
}

Commands.moveStartToStartOfPreviousBlock = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'block')
}

Commands.moveStartToStartOfPreviousInline = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'inline')
}

Commands.moveStartToStartOfPreviousText = change => {
  change.call(pointEdgeSideObject, 'start', 'start', 'previous', 'text')
}

Commands.moveStartToStartOfText = change => {
  change.call(pointEdgeObject, 'start', 'start', 'text')
}

Commands.moveTo = (change, ...args) => {
  change.call(proxy, 'moveTo', ...args)
}

Commands.moveToAnchor = change => {
  change.call(proxy, 'moveToAnchor')
}

Commands.moveToEnd = change => {
  change.call(proxy, 'moveToEnd')
}

Commands.moveToEndOfBlock = change => {
  change.moveEndToEndOfBlock().moveToEnd()
}

Commands.moveToEndOfDocument = change => {
  change.moveEndToEndOfNode(change.value.document).moveToEnd()
}

Commands.moveToEndOfInline = change => {
  change.moveEndToEndOfInline().moveToEnd()
}

Commands.moveToEndOfNextBlock = change => {
  change.moveEndToEndOfNextBlock().moveToEnd()
}

Commands.moveToEndOfNextInline = change => {
  change.moveEndToEndOfNextInline().moveToEnd()
}

Commands.moveToEndOfNextText = change => {
  change.moveEndToEndOfNextText().moveToEnd()
}

Commands.moveToEndOfNode = (change, ...args) => {
  change.call(proxy, 'moveToEndOfNode', ...args)
}

Commands.moveToEndOfPreviousBlock = change => {
  change.moveStartToEndOfPreviousBlock().moveToStart()
}

Commands.moveToEndOfPreviousInline = change => {
  change.moveStartToEndOfPreviousInline().moveToStart()
}

Commands.moveToEndOfPreviousText = change => {
  change.moveStartToEndOfPreviousText().moveToStart()
}

Commands.moveToEndOfText = change => {
  change.moveEndToEndOfText().moveToEnd()
}

Commands.moveToFocus = change => {
  change.call(proxy, 'moveToFocus')
}

Commands.moveToRangeOfDocument = change => {
  change.moveToRangeOfNode(change.value.document)
}

Commands.moveToRangeOfNode = (change, ...args) => {
  change.call(proxy, 'moveToRangeOfNode', ...args)
}

Commands.moveToStart = change => {
  change.call(proxy, 'moveToStart')
}

Commands.moveToStartOfBlock = change => {
  change.moveStartToStartOfBlock().moveToStart()
}

Commands.moveToStartOfDocument = change => {
  change.moveStartToStartOfNode(change.value.document).moveToStart()
}

Commands.moveToStartOfInline = change => {
  change.moveStartToStartOfInline().moveToStart()
}

Commands.moveToStartOfNextBlock = change => {
  change.moveEndToStartOfNextBlock().moveToEnd()
}

Commands.moveToStartOfNextInline = change => {
  change.moveEndToStartOfNextInline().moveToEnd()
}

Commands.moveToStartOfNextText = change => {
  change.moveEndToStartOfNextText().moveToEnd()
}

Commands.moveToStartOfNode = (change, ...args) => {
  change.call(proxy, 'moveToStartOfNode', ...args)
}

Commands.moveToStartOfPreviousBlock = change => {
  change.moveStartToStartOfPreviousBlock().moveToStart()
}

Commands.moveToStartOfPreviousInline = change => {
  change.moveStartToStartOfPreviousInline().moveToStart()
}

Commands.moveToStartOfPreviousText = change => {
  change.moveStartToStartOfPreviousText().moveToStart()
}

Commands.moveToStartOfText = change => {
  change.moveStartToStartOfText().moveToStart()
}

Commands.select = (change, properties, options = {}) => {
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

Commands.setAnchor = (change, ...args) => {
  change.call(proxy, 'setAnchor', ...args)
}

Commands.setEnd = (change, ...args) => {
  change.call(proxy, 'setEnd', ...args)
}

Commands.setFocus = (change, ...args) => {
  change.call(proxy, 'setFocus', ...args)
}

Commands.setStart = (change, ...args) => {
  change.call(proxy, 'setStart', ...args)
}

Commands.snapshotSelection = change => {
  change.withoutMerging(() => {
    change.select(change.value.selection, { snapshot: true })
  })
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
  const { editor, value } = change
  const { document, selection } = value
  const p = selection[point]
  const hasVoidParent = document.hasVoidParent(p.path, editor)

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
    previous && document.hasVoidParent(previous.key, editor)
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
  const { editor, value } = change
  const { document, selection } = value
  const p = selection[point]
  const text = document.getNode(p.path)
  const hasVoidParent = document.hasVoidParent(p.path, editor)

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
  const isNextInVoid = document.hasVoidParent(next.key, editor)
  change[`move${Point}ToStartOfNode`](next)

  // when is this called?
  if (!hasVoidParent && !isNextInVoid && isInBlock) {
    const range = change.value.selection[`move${Point}Forward`](n)
    change.select(range)
  }
}

function pointWordBackward(change, pointName) {
  const { value } = change
  const { document, selection } = value
  const point = selection[pointName]
  const block = document.getClosestBlock(point.key)
  const offset = block.getOffset(point.key)
  const o = offset + point.offset
  const { text } = block
  const n = TextUtils.getWordOffsetBackward(text, o)
  change.call(pointBackward, pointName, n > 0 ? n : 1)
}

function pointWordForward(change, pointName) {
  const { value } = change
  const { document, selection } = value
  const point = selection[pointName]
  const block = document.getClosestBlock(point.key)
  const offset = block.getOffset(point.key)
  const o = offset + point.offset
  const { text } = block
  const n = TextUtils.getWordOffsetForward(text, o)
  change.call(pointForward, pointName, n > 0 ? n : 1)
}

export default Commands
