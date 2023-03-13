import {
  addMark,
  deleteFragment,
  Editor,
  getDirtyPaths,
  insertBreak,
  insertFragment,
  insertNode,
  insertSoftBreak,
  insertText,
  normalizeNode,
  removeMark,
  shouldNormalize,
} from './'
import { apply } from './apply'
import { above } from './above'
import { before } from './before'
import { after } from './after'
import { marks } from './tem-plate'
import { deleteText } from './delete-text'
import { collapse } from './collapse'
import { deselect } from './deselect'
import { move } from './move'
import { select } from './select'
import { setPoint } from './set-point'
import { setSelection } from './set-selection'
import { splitNodes } from './split-nodes'
import { mergeNodes } from './merge-nodes'
import { insertNodes } from './insert-nodes'
import { liftNodes } from './lift-nodes'
import { moveNodes } from './move-nodes'
import { removeNodes } from './remove-nodes'
import { setNodes } from './set-nodes'
import { unsetNodes } from './unset-nodes'
import { unwrapNodes } from './unwrap-nodes'
import { wrapNodes } from './wrap-nodes'
import { withoutNormalizing } from './without-normalizing'
import { getVoid } from './get-void'
import { unhangRange } from './unhang-range'
import { string } from './string'
import { setNormalizing } from './set-normalizing'
import { rangeRefs } from './range-refs'
import { start } from './start'
import { rangeRef } from './range-ref'
import { range } from './range'
import { previous } from './previous'
import { positions } from './positions'
import { pointRefs } from './point-refs'
import { pointRef } from './point-ref'
import { point } from './point'
import { pathRefs } from './path-refs'
import { pathRef } from './path-ref'
import { path } from './path'
import { parent } from './parent'
import { normalize } from './normalize'
import { nodes } from './nodes'
import { node } from './node'
import { next } from './next'
import { levels } from './levels'
import { leaf } from './leaf'
import { last } from './last'
import { isStart } from './is-start'
import { isNormalizing } from './is-normalizing'
import { isEnd } from './is-end'
import { isEmpty } from './is-empty'
import { isBlock } from './is-block'
import { hasTexts } from './has-texts'
import { hasPath } from './has-path'
import { hasInlines } from './has-inlines'
import { hasBlocks } from './has-blocks'
import { fragment } from './fragment'
import { first } from './first'
import { end } from './end'
import { edges } from './edges'
import { isEdge } from './is-edge'

// export const test: WithEditorFirstArg<Editor['test']> = editor => {}
// export const test: WithEditorFirstArg<Editor['test']> = editor => {}
// export const test: WithEditorFirstArg<Editor['test']> = editor => {}

/**
 * Create a new Slate `Editor` object.
 */
export const createEditor = (): Editor => {
  const editor: Editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isInline: () => false,
    isVoid: () => false,
    markableVoid: () => false,
    onChange: () => {},

    // Core
    apply: (...args) => apply(editor, ...args),

    // Editor
    addMark: (...args) => addMark(editor, ...args),
    deleteFragment: (...args) => deleteFragment(editor, ...args),
    insertBreak: (...args) => insertBreak(editor, ...args),
    insertSoftBreak: (...args) => insertSoftBreak(editor, ...args),
    insertFragment: (...args) => insertFragment(editor, ...args),
    insertNode: (...args) => insertNode(editor, ...args),
    insertText: (...args) => insertText(editor, ...args),
    normalizeNode: (...args) => normalizeNode(editor, ...args),
    removeMark: (...args) => removeMark(editor, ...args),
    getDirtyPaths: (...args) => getDirtyPaths(editor, ...args),
    shouldNormalize: (...args) => shouldNormalize(editor, ...args),

    // Editor interface
    above: (...args) => above(editor, ...args),
    after: (...args) => after(editor, ...args),
    before: (...args) => before(editor, ...args),
    collapse: (...args) => collapse(editor, ...args),
    delete: (...args) => deleteText(editor, ...args),
    deselect: (...args) => deselect(editor, ...args),
    edges: (...args) => edges(editor, ...args),
    end: (...args) => end(editor, ...args),
    first: (...args) => first(editor, ...args),
    fragment: (...args) => fragment(editor, ...args),
    getMarks: (...args) => marks(editor, ...args),
    hasBlocks: (...args) => hasBlocks(editor, ...args),
    hasInlines: (...args) => hasInlines(editor, ...args),
    hasPath: (...args) => hasPath(editor, ...args),
    hasTexts: (...args) => hasTexts(editor, ...args),
    insertNodes: (...args) => insertNodes(editor, ...args),
    isBlock: (...args) => isBlock(editor, ...args),
    isEdge: (...args) => isEdge(editor, ...args),
    isEmpty: (...args) => isEmpty(editor, ...args),
    isEnd: (...args) => isEnd(editor, ...args),
    isNormalizing: (...args) => isNormalizing(editor, ...args),
    isStart: (...args) => isStart(editor, ...args),
    last: (...args) => last(editor, ...args),
    leaf: (...args) => leaf(editor, ...args),
    levels: (...args) => levels(editor, ...args),
    liftNodes: (...args) => liftNodes(editor, ...args),
    mergeNodes: (...args) => mergeNodes(editor, ...args),
    move: (...args) => move(editor, ...args),
    moveNodes: (...args) => moveNodes(editor, ...args),
    next: (...args) => next(editor, ...args),
    node: (...args) => node(editor, ...args),
    nodes: (...args) => nodes(editor, ...args),
    normalize: (...args) => normalize(editor, ...args),
    parent: (...args) => parent(editor, ...args),
    path: (...args) => path(editor, ...args),
    pathRef: (...args) => pathRef(editor, ...args),
    pathRefs: (...args) => pathRefs(editor, ...args),
    point: (...args) => point(editor, ...args),
    pointRef: (...args) => pointRef(editor, ...args),
    pointRefs: (...args) => pointRefs(editor, ...args),
    positions: (...args) => positions(editor, ...args),
    previous: (...args) => previous(editor, ...args),
    range: (...args) => range(editor, ...args),
    rangeRef: (...args) => rangeRef(editor, ...args),
    rangeRefs: (...args) => rangeRefs(editor, ...args),
    removeNodes: (...args) => removeNodes(editor, ...args),
    select: (...args) => select(editor, ...args),
    setNodes: (...args) => setNodes(editor, ...args),
    setNormalizing: (...args) => setNormalizing(editor, ...args),
    setPoint: (...args) => setPoint(editor, ...args),
    setSelection: (...args) => setSelection(editor, ...args),
    splitNodes: (...args) => splitNodes(editor, ...args),
    start: (...args) => start(editor, ...args),
    string: (...args) => string(editor, ...args),
    unhangRange: (...args) => unhangRange(editor, ...args),
    unsetNodes: (...args) => unsetNodes(editor, ...args),
    unwrapNodes: (...args) => unwrapNodes(editor, ...args),
    void: (...args) => getVoid(editor, ...args),
    withoutNormalizing: (...args) => withoutNormalizing(editor, ...args),
    wrapNodes: (...args) => wrapNodes(editor, ...args),
  }

  return editor
}
