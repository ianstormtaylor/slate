import { Editor, EditorInterface } from '../interfaces/editor'
import { Range } from '../interfaces/range'
import { Node } from '../interfaces/node'
import { Operation } from '../interfaces/operation'
import { isObject } from '../utils'

export const isEditor: EditorInterface['isEditor'] = (
  value: any,
  { deep = false } = {}
): value is Editor => {
  if (!isObject(value)) {
    return false
  }

  const isEditor =
    typeof value.above === 'function' &&
    typeof value.addMark === 'function' &&
    typeof value.after === 'function' &&
    typeof value.apply === 'function' &&
    typeof value.before === 'function' &&
    typeof value.collapse === 'function' &&
    typeof value.delete === 'function' &&
    typeof value.deleteBackward === 'function' &&
    typeof value.deleteForward === 'function' &&
    typeof value.deleteFragment === 'function' &&
    typeof value.deselect === 'function' &&
    typeof value.edges === 'function' &&
    typeof value.elementReadOnly === 'function' &&
    typeof value.end === 'function' &&
    typeof value.first === 'function' &&
    typeof value.fragment === 'function' &&
    typeof value.getDirtyPaths === 'function' &&
    typeof value.getFragment === 'function' &&
    typeof value.getMarks === 'function' &&
    typeof value.hasBlocks === 'function' &&
    typeof value.hasInlines === 'function' &&
    typeof value.hasPath === 'function' &&
    typeof value.hasTexts === 'function' &&
    typeof value.insertBreak === 'function' &&
    typeof value.insertFragment === 'function' &&
    typeof value.insertNode === 'function' &&
    typeof value.insertNodes === 'function' &&
    typeof value.insertSoftBreak === 'function' &&
    typeof value.insertText === 'function' &&
    typeof value.isBlock === 'function' &&
    typeof value.isEdge === 'function' &&
    typeof value.isElementReadOnly === 'function' &&
    typeof value.isEmpty === 'function' &&
    typeof value.isEnd === 'function' &&
    typeof value.isInline === 'function' &&
    typeof value.isNormalizing === 'function' &&
    typeof value.isSelectable === 'function' &&
    typeof value.isStart === 'function' &&
    typeof value.isVoid === 'function' &&
    typeof value.last === 'function' &&
    typeof value.leaf === 'function' &&
    typeof value.levels === 'function' &&
    typeof value.liftNodes === 'function' &&
    typeof value.markableVoid === 'function' &&
    typeof value.mergeNodes === 'function' &&
    typeof value.move === 'function' &&
    typeof value.moveNodes === 'function' &&
    typeof value.next === 'function' &&
    typeof value.node === 'function' &&
    typeof value.nodes === 'function' &&
    typeof value.normalize === 'function' &&
    typeof value.normalizeNode === 'function' &&
    typeof value.onChange === 'function' &&
    typeof value.parent === 'function' &&
    typeof value.path === 'function' &&
    typeof value.pathRef === 'function' &&
    typeof value.pathRefs === 'function' &&
    typeof value.point === 'function' &&
    typeof value.pointRef === 'function' &&
    typeof value.pointRefs === 'function' &&
    typeof value.positions === 'function' &&
    typeof value.previous === 'function' &&
    typeof value.range === 'function' &&
    typeof value.rangeRef === 'function' &&
    typeof value.rangeRefs === 'function' &&
    typeof value.removeMark === 'function' &&
    typeof value.removeNodes === 'function' &&
    typeof value.select === 'function' &&
    typeof value.setNodes === 'function' &&
    typeof value.setNormalizing === 'function' &&
    typeof value.setPoint === 'function' &&
    typeof value.setSelection === 'function' &&
    typeof value.shouldMergeNodesRemovePrevNode === 'function' &&
    typeof value.shouldNormalize === 'function' &&
    typeof value.splitNodes === 'function' &&
    typeof value.start === 'function' &&
    typeof value.string === 'function' &&
    typeof value.unhangRange === 'function' &&
    typeof value.unsetNodes === 'function' &&
    typeof value.unwrapNodes === 'function' &&
    typeof value.void === 'function' &&
    typeof value.withoutNormalizing === 'function' &&
    typeof value.wrapNodes === 'function' &&
    (value.marks === null || isObject(value.marks)) &&
    (value.selection === null || Range.isRange(value.selection)) &&
    (deep
      ? Node.isNodeList(value.children) &&
        Operation.isOperationList(value.operations)
      : Array.isArray(value.children) && Array.isArray(value.operations))

  return isEditor
}
