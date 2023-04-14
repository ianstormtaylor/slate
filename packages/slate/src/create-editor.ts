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
import { apply } from './core/apply'
import { above } from './editor/above'
import { before } from './editor/before'
import { after } from './editor/after'
import { marks } from './editor/tem-plate'
import { deleteText } from './transforms-text/delete-text'
import { collapse } from './transforms-selection/collapse'
import { deselect } from './transforms-selection/deselect'
import { move } from './transforms-selection/move'
import { select } from './transforms-selection/select'
import { setPoint } from './transforms-selection/set-point'
import { setSelection } from './transforms-selection/set-selection'
import { splitNodes } from './transforms-node/split-nodes'
import { mergeNodes } from './transforms-node/merge-nodes'
import { insertNodes } from './transforms-node/insert-nodes'
import { liftNodes } from './transforms-node/lift-nodes'
import { moveNodes } from './transforms-node/move-nodes'
import { removeNodes } from './transforms-node/remove-nodes'
import { setNodes } from './transforms-node/set-nodes'
import { unsetNodes } from './transforms-node/unset-nodes'
import { unwrapNodes } from './transforms-node/unwrap-nodes'
import { wrapNodes } from './transforms-node/wrap-nodes'
import { withoutNormalizing } from './editor/without-normalizing'
import { getVoid } from './editor/get-void'
import { unhangRange } from './editor/unhang-range'
import { string } from './editor/string'
import { setNormalizing } from './editor/set-normalizing'
import { rangeRefs } from './editor/range-refs'
import { start } from './editor/start'
import { rangeRef } from './editor/range-ref'
import { range } from './editor/range'
import { previous } from './editor/previous'
import { positions } from './editor/positions'
import { pointRefs } from './editor/point-refs'
import { pointRef } from './editor/point-ref'
import { point } from './editor/point'
import { pathRefs } from './editor/path-refs'
import { pathRef } from './editor/path-ref'
import { path } from './editor/path'
import { parent } from './editor/parent'
import { normalize } from './editor/normalize'
import { nodes } from './editor/nodes'
import { node } from './editor/node'
import { next } from './editor/next'
import { levels } from './editor/levels'
import { leaf } from './editor/leaf'
import { last } from './editor/last'
import { isStart } from './editor/is-start'
import { isNormalizing } from './editor/is-normalizing'
import { isEnd } from './editor/is-end'
import { isEmpty } from './editor/is-empty'
import { isBlock } from './editor/is-block'
import { hasTexts } from './editor/has-texts'
import { hasPath } from './editor/has-path'
import { hasInlines } from './editor/has-inlines'
import { hasBlocks } from './editor/has-blocks'
import { fragment } from './editor/fragment'
import { first } from './editor/first'
import { end } from './editor/end'
import { edges } from './editor/edges'
import { isEdge } from './editor/is-edge'

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
    isElementReadOnly: () => false,
    isInline: () => false,
    isSelectable: () => true,
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
