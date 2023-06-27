import { Editor, EditorInterface } from '../interfaces/editor'
import { isPlainObject } from 'is-plain-object'
import { Range } from '../interfaces/range'
import { Node } from '../interfaces/node'
import { Operation } from '../interfaces/operation'

const IS_EDITOR_CACHE = new WeakMap<object, boolean>()

export const isEditor: EditorInterface['isEditor'] = (
  value: any
): value is Editor => {
  const cachedIsEditor = IS_EDITOR_CACHE.get(value)
  if (cachedIsEditor !== undefined) {
    return cachedIsEditor
  }

  if (!isPlainObject(value)) {
    return false
  }

  const isEditor =
    typeof value.addMark === 'function' &&
    typeof value.apply === 'function' &&
    typeof value.deleteFragment === 'function' &&
    typeof value.insertBreak === 'function' &&
    typeof value.insertSoftBreak === 'function' &&
    typeof value.insertFragment === 'function' &&
    typeof value.insertNode === 'function' &&
    typeof value.insertText === 'function' &&
    typeof value.isElementReadOnly === 'function' &&
    typeof value.isInline === 'function' &&
    typeof value.isSelectable === 'function' &&
    typeof value.isVoid === 'function' &&
    typeof value.normalizeNode === 'function' &&
    typeof value.onChange === 'function' &&
    typeof value.removeMark === 'function' &&
    typeof value.getDirtyPaths === 'function' &&
    (value.marks === null || isPlainObject(value.marks)) &&
    (value.selection === null || Range.isRange(value.selection)) &&
    Node.isNodeList(value.children) &&
    Operation.isOperationList(value.operations)
  IS_EDITOR_CACHE.set(value, isEditor)
  return isEditor
}
