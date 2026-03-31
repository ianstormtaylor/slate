import { Descendant } from '../interfaces/node'
import { BaseSetNodeOperation } from '../interfaces/operation'
import { Editor } from '../interfaces/editor'
import {
  BATCH_DRAFT_CHILDREN,
  BATCH_DEPTH,
  BATCH_EXACT_SET_NODE_OPS,
  BATCH_EXACT_SET_NODE_SNAPSHOT,
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS,
  CHILDREN,
} from '../utils/weak-maps'
import { applySetNodeBatchToChildren } from './exact-set-node-children'

export const getChildren = (editor: Editor): Descendant[] =>
  hasExactSetNodeDraft(editor)
    ? materializeExactSetNodeDraft(editor)
    : hasDraftChildren(editor)
    ? getDraftChildren(editor)
    : getCommittedChildren(editor)

export const getCommittedChildren = (editor: Editor): Descendant[] =>
  CHILDREN.get(editor) ?? []

export const setChildren = (editor: Editor, children: Descendant[]) => {
  clearExactSetNodeDraft(editor)

  if (isBatching(editor)) {
    BATCH_DRAFT_CHILDREN.set(editor, children)
    return
  }

  clearDraftChildren(editor)
  CHILDREN.set(editor, children)
}

export const hasDraftChildren = (editor: Editor) =>
  BATCH_DRAFT_CHILDREN.has(editor)

export const getDraftChildren = (editor: Editor): Descendant[] =>
  BATCH_DRAFT_CHILDREN.get(editor) ?? []

export const setDraftChildren = (editor: Editor, children: Descendant[]) => {
  clearExactSetNodeDraft(editor)
  BATCH_DRAFT_CHILDREN.set(editor, children)
}

export const clearDraftChildren = (editor: Editor) => {
  BATCH_DRAFT_CHILDREN.delete(editor)
}

export const hasExactSetNodeDraft = (editor: Editor) =>
  (BATCH_EXACT_SET_NODE_OPS.get(editor)?.length ?? 0) > 0

export const stageExactSetNodeOperation = (
  editor: Editor,
  op: BaseSetNodeOperation
) => {
  const ops = BATCH_EXACT_SET_NODE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_EXACT_SET_NODE_OPS.set(editor, [op])
}

export const materializeExactSetNodeDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_EXACT_SET_NODE_OPS.get(editor) ?? []
  const snapshot = BATCH_EXACT_SET_NODE_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return getCommittedChildren(editor)
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const baseChildren = snapshot ?? getCommittedChildren(editor)
  const nextChildren = applySetNodeBatchToChildren(
    baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_EXACT_SET_NODE_SNAPSHOT.set(editor, nextChildren)
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteExactSetNodeDraftToDraftChildren = (editor: Editor) => {
  if (!hasExactSetNodeDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeExactSetNodeDraft(editor))
}

export const commitExactSetNodeDraft = (editor: Editor) => {
  if (!hasExactSetNodeDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeExactSetNodeDraft(editor))
  clearExactSetNodeDraft(editor)
}

export const commitDraftChildren = (editor: Editor) => {
  if (hasDraftChildren(editor)) {
    CHILDREN.set(editor, getDraftChildren(editor))
    clearDraftChildren(editor)
    return
  }

  commitExactSetNodeDraft(editor)
}

export const clearExactSetNodeDraft = (editor: Editor) => {
  BATCH_EXACT_SET_NODE_OPS.delete(editor)
  BATCH_EXACT_SET_NODE_SNAPSHOT.delete(editor)
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.delete(editor)
}

export const defineChildrenAccessor = (editor: Editor) => {
  Object.defineProperty(editor, 'children', {
    configurable: true,
    enumerable: true,
    get() {
      return getChildren(editor)
    },
    set(children: Descendant[]) {
      setChildren(editor, children)
    },
  })
}

export const isBatching = (editor: Editor) => (BATCH_DEPTH.get(editor) ?? 0) > 0
