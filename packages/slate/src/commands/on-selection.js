import { is } from 'immutable'
import pick from 'lodash/pick'

import Selection from '../models/selection'
import TextUtils from '../utils/text-utils'

const Commands = {}

Commands.blur = editor => {
  editor.select({ isFocused: false })
}

Commands.deselect = editor => {
  const range = Selection.create()
  editor.select(range)
}

Commands.focus = editor => {
  editor.select({ isFocused: true })
}

Commands.flip = editor => {
  editor.command(proxy, 'flip')
}

Commands.moveAnchorBackward = (editor, ...args) => {
  editor.command(pointBackward, 'anchor', ...args)
}

Commands.moveAnchorWordBackward = (editor, ...args) => {
  editor.command(pointWordBackward, 'anchor', ...args)
}

Commands.moveAnchorForward = (editor, ...args) => {
  editor.command(pointForward, 'anchor', ...args)
}

Commands.moveAnchorWordForward = (editor, ...args) => {
  editor.command(pointWordForward, 'anchor', ...args)
}

Commands.moveAnchorTo = (editor, ...args) => {
  editor.command(proxy, 'moveAnchorTo', ...args)
}

Commands.moveAnchorToEndOfBlock = editor => {
  editor.command(pointEdgeObject, 'anchor', 'end', 'block')
}

Commands.moveAnchorToEndOfInline = editor => {
  editor.command(pointEdgeObject, 'anchor', 'end', 'inline')
}

Commands.moveAnchorToEndOfDocument = editor => {
  editor.moveAnchorToEndOfNode(editor.value.document).moveToAnchor()
}

Commands.moveAnchorToEndOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'next', 'block')
}

Commands.moveAnchorToEndOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'next', 'inline')
}

Commands.moveAnchorToEndOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'next', 'text')
}

Commands.moveAnchorToEndOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveAnchorToEndOfNode', ...args)
}

Commands.moveAnchorToEndOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'previous', 'block')
}

Commands.moveAnchorToEndOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'previous', 'inline')
}

Commands.moveAnchorToEndOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'end', 'previous', 'text')
}

Commands.moveAnchorToEndOfText = editor => {
  editor.command(pointEdgeObject, 'anchor', 'end', 'text')
}

Commands.moveAnchorToStartOfBlock = editor => {
  editor.command(pointEdgeObject, 'anchor', 'start', 'block')
}

Commands.moveAnchorToStartOfDocument = editor => {
  editor.moveAnchorToStartOfNode(editor.value.document).moveToAnchor()
}

Commands.moveAnchorToStartOfInline = editor => {
  editor.command(pointEdgeObject, 'anchor', 'start', 'inline')
}

Commands.moveAnchorToStartOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'next', 'block')
}

Commands.moveAnchorToStartOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'next', 'inline')
}

Commands.moveAnchorToStartOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'next', 'text')
}

Commands.moveAnchorToStartOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveAnchorToStartOfNode', ...args)
}

Commands.moveAnchorToStartOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'previous', 'block')
}

Commands.moveAnchorToStartOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'previous', 'inline')
}

Commands.moveAnchorToStartOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'anchor', 'start', 'previous', 'text')
}

Commands.moveAnchorToStartOfText = editor => {
  editor.command(pointEdgeObject, 'anchor', 'start', 'text')
}

Commands.moveBackward = (editor, ...args) => {
  editor.moveAnchorBackward(...args).moveFocusBackward(...args)
}

Commands.moveWordBackward = (editor, ...args) => {
  editor.moveFocusWordBackward(...args).moveToFocus()
}

Commands.moveEndBackward = (editor, ...args) => {
  editor.command(pointBackward, 'end', ...args)
}

Commands.moveEndWordBackward = (editor, ...args) => {
  editor.command(pointWordBackward, 'end', ...args)
}

Commands.moveEndForward = (editor, ...args) => {
  editor.command(pointForward, 'end', ...args)
}

Commands.moveEndWordForward = (editor, ...args) => {
  editor.command(pointWordForward, 'end', ...args)
}

Commands.moveEndTo = (editor, ...args) => {
  editor.command(proxy, 'moveEndTo', ...args)
}

Commands.moveEndToEndOfBlock = editor => {
  editor.command(pointEdgeObject, 'end', 'end', 'block')
}

Commands.moveEndToEndOfDocument = editor => {
  editor.moveEndToEndOfNode(editor.value.document).moveToEnd()
}

Commands.moveEndToEndOfInline = editor => {
  editor.command(pointEdgeObject, 'end', 'end', 'inline')
}

Commands.moveEndToEndOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'next', 'block')
}

Commands.moveEndToEndOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'next', 'inline')
}

Commands.moveEndToEndOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'next', 'text')
}

Commands.moveEndToEndOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveEndToEndOfNode', ...args)
}

Commands.moveEndToEndOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'previous', 'block')
}

Commands.moveEndToEndOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'previous', 'inline')
}

Commands.moveEndToEndOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'end', 'end', 'previous', 'text')
}

Commands.moveEndToEndOfText = editor => {
  editor.command(pointEdgeObject, 'end', 'end', 'text')
}

Commands.moveEndToStartOfBlock = editor => {
  editor.command(pointEdgeObject, 'end', 'start', 'block')
}

Commands.moveEndToStartOfDocument = editor => {
  editor.moveEndToStartOfNode(editor.value.document).moveToEnd()
}

Commands.moveEndToStartOfInline = editor => {
  editor.command(pointEdgeObject, 'end', 'start', 'inline')
}

Commands.moveEndToStartOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'next', 'block')
}

Commands.moveEndToStartOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'next', 'inline')
}

Commands.moveEndToStartOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'next', 'text')
}

Commands.moveEndToStartOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveEndToStartOfNode', ...args)
}

Commands.moveEndToStartOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'previous', 'block')
}

Commands.moveEndToStartOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'previous', 'inline')
}

Commands.moveEndToStartOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'end', 'start', 'previous', 'text')
}

Commands.moveEndToStartOfText = editor => {
  editor.command(pointEdgeObject, 'end', 'start', 'text')
}

Commands.moveFocusBackward = (editor, ...args) => {
  editor.command(pointBackward, 'focus', ...args)
}

Commands.moveFocusWordBackward = (editor, ...args) => {
  editor.command(pointWordBackward, 'focus', ...args)
}

Commands.moveFocusForward = (editor, ...args) => {
  editor.command(pointForward, 'focus', ...args)
}

Commands.moveFocusWordForward = (editor, ...args) => {
  editor.command(pointWordForward, 'focus', ...args)
}

Commands.moveFocusTo = (editor, ...args) => {
  editor.command(proxy, 'moveFocusTo', ...args)
}

Commands.moveFocusToEndOfBlock = editor => {
  editor.command(pointEdgeObject, 'focus', 'end', 'block')
}

Commands.moveFocusToEndOfDocument = editor => {
  editor.moveFocusToEndOfNode(editor.value.document).moveToFocus()
}

Commands.moveFocusToEndOfInline = editor => {
  editor.command(pointEdgeObject, 'focus', 'end', 'inline')
}

Commands.moveFocusToEndOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'next', 'block')
}

Commands.moveFocusToEndOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'next', 'inline')
}

Commands.moveFocusToEndOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'next', 'text')
}

Commands.moveFocusToEndOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveFocusToEndOfNode', ...args)
}

Commands.moveFocusToEndOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'previous', 'block')
}

Commands.moveFocusToEndOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'previous', 'inline')
}

Commands.moveFocusToEndOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'end', 'previous', 'text')
}

Commands.moveFocusToEndOfText = editor => {
  editor.command(pointEdgeObject, 'focus', 'end', 'text')
}

Commands.moveFocusToStartOfBlock = editor => {
  editor.command(pointEdgeObject, 'focus', 'start', 'block')
}

Commands.moveFocusToStartOfDocument = editor => {
  editor.moveFocusToStartOfNode(editor.value.document).moveToFocus()
}

Commands.moveFocusToStartOfInline = editor => {
  editor.command(pointEdgeObject, 'focus', 'start', 'inline')
}

Commands.moveFocusToStartOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'next', 'block')
}

Commands.moveFocusToStartOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'next', 'inline')
}

Commands.moveFocusToStartOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'next', 'text')
}

Commands.moveFocusToStartOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveFocusToStartOfNode', ...args)
}

Commands.moveFocusToStartOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'previous', 'block')
}

Commands.moveFocusToStartOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'previous', 'inline')
}

Commands.moveFocusToStartOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'focus', 'start', 'previous', 'text')
}

Commands.moveFocusToStartOfText = editor => {
  editor.command(pointEdgeObject, 'focus', 'start', 'text')
}

Commands.moveForward = (editor, ...args) => {
  editor.moveAnchorForward(...args).moveFocusForward(...args)
}

Commands.moveWordForward = (editor, ...args) => {
  editor.moveFocusWordForward(...args).moveToFocus(...args)
}

Commands.moveStartBackward = (editor, ...args) => {
  editor.command(pointBackward, 'start', ...args)
}

Commands.moveStartWordBackward = (editor, ...args) => {
  editor.command(pointWordBackward, 'start', ...args)
}

Commands.moveStartForward = (editor, ...args) => {
  editor.command(pointForward, 'start', ...args)
}

Commands.moveStartWordForward = (editor, ...args) => {
  editor.command(pointWordForward, 'start', ...args)
}

Commands.moveStartTo = (editor, ...args) => {
  editor.command(proxy, 'moveStartTo', ...args)
}

Commands.moveStartToEndOfBlock = editor => {
  editor.command(pointEdgeObject, 'start', 'end', 'block')
}

Commands.moveStartToEndOfDocument = editor => {
  editor.moveStartToEndOfNode(editor.value.document).moveToStart()
}

Commands.moveStartToEndOfInline = editor => {
  editor.command(pointEdgeObject, 'start', 'end', 'inline')
}

Commands.moveStartToEndOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'next', 'block')
}

Commands.moveStartToEndOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'next', 'inline')
}

Commands.moveStartToEndOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'next', 'text')
}

Commands.moveStartToEndOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveStartToEndOfNode', ...args)
}

Commands.moveStartToEndOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'previous', 'block')
}

Commands.moveStartToEndOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'previous', 'inline')
}

Commands.moveStartToEndOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'start', 'end', 'previous', 'text')
}

Commands.moveStartToEndOfText = editor => {
  editor.command(pointEdgeObject, 'start', 'end', 'text')
}

Commands.moveStartToStartOfBlock = editor => {
  editor.command(pointEdgeObject, 'start', 'start', 'block')
}

Commands.moveStartToStartOfDocument = editor => {
  editor.moveStartToStartOfNode(editor.value.document).moveToStart()
}

Commands.moveStartToStartOfInline = editor => {
  editor.command(pointEdgeObject, 'start', 'start', 'inline')
}

Commands.moveStartToStartOfNextBlock = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'next', 'block')
}

Commands.moveStartToStartOfNextInline = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'next', 'inline')
}

Commands.moveStartToStartOfNextText = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'next', 'text')
}

Commands.moveStartToStartOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveStartToStartOfNode', ...args)
}

Commands.moveStartToStartOfPreviousBlock = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'previous', 'block')
}

Commands.moveStartToStartOfPreviousInline = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'previous', 'inline')
}

Commands.moveStartToStartOfPreviousText = editor => {
  editor.command(pointEdgeSideObject, 'start', 'start', 'previous', 'text')
}

Commands.moveStartToStartOfText = editor => {
  editor.command(pointEdgeObject, 'start', 'start', 'text')
}

Commands.moveTo = (editor, ...args) => {
  editor.command(proxy, 'moveTo', ...args)
}

Commands.moveToAnchor = editor => {
  editor.command(proxy, 'moveToAnchor')
}

Commands.moveToEnd = editor => {
  editor.command(proxy, 'moveToEnd')
}

Commands.moveToEndOfBlock = editor => {
  editor.moveEndToEndOfBlock().moveToEnd()
}

Commands.moveToEndOfDocument = editor => {
  editor.moveEndToEndOfNode(editor.value.document).moveToEnd()
}

Commands.moveToEndOfInline = editor => {
  editor.moveEndToEndOfInline().moveToEnd()
}

Commands.moveToEndOfNextBlock = editor => {
  editor.moveEndToEndOfNextBlock().moveToEnd()
}

Commands.moveToEndOfNextInline = editor => {
  editor.moveEndToEndOfNextInline().moveToEnd()
}

Commands.moveToEndOfNextText = editor => {
  editor.moveEndToEndOfNextText().moveToEnd()
}

Commands.moveToEndOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveToEndOfNode', ...args)
}

Commands.moveToEndOfPreviousBlock = editor => {
  editor.moveStartToEndOfPreviousBlock().moveToStart()
}

Commands.moveToEndOfPreviousInline = editor => {
  editor.moveStartToEndOfPreviousInline().moveToStart()
}

Commands.moveToEndOfPreviousText = editor => {
  editor.moveStartToEndOfPreviousText().moveToStart()
}

Commands.moveToEndOfText = editor => {
  editor.moveEndToEndOfText().moveToEnd()
}

Commands.moveToFocus = editor => {
  editor.command(proxy, 'moveToFocus')
}

Commands.moveToRangeOfDocument = editor => {
  editor.moveToRangeOfNode(editor.value.document)
}

Commands.moveToRangeOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveToRangeOfNode', ...args)
}

Commands.moveToStart = editor => {
  editor.command(proxy, 'moveToStart')
}

Commands.moveToStartOfBlock = editor => {
  editor.moveStartToStartOfBlock().moveToStart()
}

Commands.moveToStartOfDocument = editor => {
  editor.moveStartToStartOfNode(editor.value.document).moveToStart()
}

Commands.moveToStartOfInline = editor => {
  editor.moveStartToStartOfInline().moveToStart()
}

Commands.moveToStartOfNextBlock = editor => {
  editor.moveEndToStartOfNextBlock().moveToEnd()
}

Commands.moveToStartOfNextInline = editor => {
  editor.moveEndToStartOfNextInline().moveToEnd()
}

Commands.moveToStartOfNextText = editor => {
  editor.moveEndToStartOfNextText().moveToEnd()
}

Commands.moveToStartOfNode = (editor, ...args) => {
  editor.command(proxy, 'moveToStartOfNode', ...args)
}

Commands.moveToStartOfPreviousBlock = editor => {
  editor.moveStartToStartOfPreviousBlock().moveToStart()
}

Commands.moveToStartOfPreviousInline = editor => {
  editor.moveStartToStartOfPreviousInline().moveToStart()
}

Commands.moveToStartOfPreviousText = editor => {
  editor.moveStartToStartOfPreviousText().moveToStart()
}

Commands.moveToStartOfText = editor => {
  editor.moveStartToStartOfText().moveToStart()
}

Commands.select = (editor, properties, options = {}) => {
  properties = Selection.createProperties(properties)
  const { snapshot = false } = options
  const { value } = editor
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
  // properties editor the marks in some way.
  if (selection.marks && !props.marks && (props.anchor || props.focus)) {
    props.marks = null
  }

  // If there are no new properties to set, abort to avoid extra operations.
  if (Object.keys(props).length === 0) {
    return
  }

  editor.applyOperation(
    {
      type: 'set_selection',
      value,
      properties: props,
      selection: selection.toJSON(),
    },
    snapshot ? { skip: false, merge: false } : {}
  )
}

Commands.setAnchor = (editor, ...args) => {
  editor.command(proxy, 'setAnchor', ...args)
}

Commands.setEnd = (editor, ...args) => {
  editor.command(proxy, 'setEnd', ...args)
}

Commands.setFocus = (editor, ...args) => {
  editor.command(proxy, 'setFocus', ...args)
}

Commands.setStart = (editor, ...args) => {
  editor.command(proxy, 'setStart', ...args)
}

Commands.snapshotSelection = editor => {
  editor.withoutMerging(() => {
    editor.select(editor.value.selection, { snapshot: true })
  })
}

/**
 * Helpers.
 */

function proxy(editor, method, ...args) {
  const range = editor.value.selection[method](...args)
  editor.select(range)
}

function pointEdgeObject(editor, point, edge, object) {
  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const Edge = edge.slice(0, 1).toUpperCase() + edge.slice(1)
  const Object = object.slice(0, 1).toUpperCase() + object.slice(1)
  const method = `move${Point}To${Edge}OfNode`
  const getNode = object == 'text' ? 'getNode' : `getClosest${Object}`
  const { value } = editor
  const { document, selection } = value
  const p = selection[point]
  const node = document[getNode](p.key)
  if (!node) return
  editor[method](node)
}

function pointEdgeSideObject(editor, point, edge, side, object) {
  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const Edge = edge.slice(0, 1).toUpperCase() + edge.slice(1)
  const Side = side.slice(0, 1).toUpperCase() + side.slice(1)
  const Object = object.slice(0, 1).toUpperCase() + object.slice(1)
  const method = `move${Point}To${Edge}OfNode`
  const getNode = object == 'text' ? 'getNode' : `getClosest${Object}`
  const getDirectionNode = `get${Side}${Object}`
  const { value } = editor
  const { document, selection } = value
  const p = selection[point]
  const node = document[getNode](p.key)
  if (!node) return
  const target = document[getDirectionNode](node.key)
  if (!target) return
  editor[method](target)
}

function pointBackward(editor, point, n = 1) {
  if (n === 0) return
  if (n < 0) return pointForward(editor, point, -n)

  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const { value } = editor
  const { document, selection } = value
  const p = selection[point]
  const hasVoidParent = document.hasVoidParent(p.path, editor)

  // what is this?
  if (!hasVoidParent && p.offset - n >= 0) {
    const range = selection[`move${Point}Backward`](n)
    editor.select(range)
    return
  }

  const previous = document.getPreviousText(p.path)
  if (!previous) return

  const block = document.getClosestBlock(p.path)
  const isInBlock = block.hasNode(previous.key)
  const isPreviousInVoid =
    previous && document.hasVoidParent(previous.key, editor)
  editor[`move${Point}ToEndOfNode`](previous)

  // when is this called?
  if (!hasVoidParent && !isPreviousInVoid && isInBlock) {
    const range = editor.value.selection[`move${Point}Backward`](n)
    editor.select(range)
  }
}

function pointForward(editor, point, n = 1) {
  if (n === 0) return
  if (n < 0) return pointBackward(editor, point, -n)

  const Point = point.slice(0, 1).toUpperCase() + point.slice(1)
  const { value } = editor
  const { document, selection } = value
  const p = selection[point]
  const text = document.getNode(p.path)
  const hasVoidParent = document.hasVoidParent(p.path, editor)

  // what is this?
  if (!hasVoidParent && p.offset + n <= text.text.length) {
    const range = selection[`move${Point}Forward`](n)
    editor.select(range)
    return
  }

  const next = document.getNextText(p.path)
  if (!next) return

  const block = document.getClosestBlock(p.path)
  const isInBlock = block.hasNode(next.key)
  const isNextInVoid = document.hasVoidParent(next.key, editor)
  editor[`move${Point}ToStartOfNode`](next)

  // when is this called?
  if (!hasVoidParent && !isNextInVoid && isInBlock) {
    const range = editor.value.selection[`move${Point}Forward`](n)
    editor.select(range)
  }
}

function pointWordBackward(editor, pointName) {
  const { value } = editor
  const { document, selection } = value
  const point = selection[pointName]
  const block = document.getClosestBlock(point.key)
  const offset = block.getOffset(point.key)
  const o = offset + point.offset
  const { text } = block
  const n = TextUtils.getWordOffsetBackward(text, o)
  editor.command(pointBackward, pointName, n > 0 ? n : 1)
}

function pointWordForward(editor, pointName) {
  const { value } = editor
  const { document, selection } = value
  const point = selection[pointName]
  const block = document.getClosestBlock(point.key)
  const offset = block.getOffset(point.key)
  const o = offset + point.offset
  const { text } = block
  const n = TextUtils.getWordOffsetForward(text, o)
  editor.command(pointForward, pointName, n > 0 ? n : 1)
}

export default Commands
