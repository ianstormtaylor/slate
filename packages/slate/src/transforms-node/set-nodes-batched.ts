import { Editor } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { BaseSetNodeOperation } from '../interfaces/operation'
import { Path } from '../interfaces/path'
import { updateDirtyPaths } from '../core/update-dirty-paths'
import { FLUSHING } from '../utils/weak-maps'

export type NodeBatchUpdate<T extends Node = Node> = {
  at: Path
  props: Partial<T>
}

type BatchTreeNode = {
  children: Map<number, BatchTreeNode>
  op?: BaseSetNodeOperation
}

const createBatchTreeNode = (): BatchTreeNode => ({
  children: new Map(),
})

const applySetNodeOperation = (node: Node, op: BaseSetNodeOperation): Node => {
  const { properties, newProperties } = op
  const nextNode = { ...node }
  const mutableNode = nextNode as Record<string, unknown>

  for (const key in newProperties) {
    if (key === 'children' || key === 'text') {
      throw new Error(`Cannot set the "${key}" property of nodes!`)
    }

    const value = newProperties[key as keyof Node]

    if (value == null) {
      delete mutableNode[key]
    } else {
      mutableNode[key] = value
    }
  }

  for (const key in properties) {
    if (!newProperties.hasOwnProperty(key)) {
      delete mutableNode[key]
    }
  }

  return nextNode
}

const applyBatchToNode = (node: Node, branch: BatchTreeNode): Node => {
  let nextNode = node

  if (branch.children.size > 0) {
    if (!Node.isElement(node)) {
      throw new Error(
        `Cannot apply batched node updates beneath non-element node at operation path [${
          branch.op?.path ?? ''
        }]`
      )
    }

    const nextChildren = node.children.slice()
    let hasChildChanges = false

    for (const [index, childBranch] of branch.children) {
      const child = node.children[index]

      if (!child) {
        throw new Error(
          `Cannot apply batched set_node operations because path [${index}] does not exist in the current branch.`
        )
      }

      const nextChild = applyBatchToNode(child, childBranch)

      if (nextChild !== child) {
        nextChildren[index] = nextChild
        hasChildChanges = true
      }
    }

    if (hasChildChanges) {
      nextNode = {
        ...nextNode,
        children: nextChildren,
      } as Node
    }
  }

  if (branch.op) {
    nextNode = applySetNodeOperation(nextNode, branch.op)
  }

  return nextNode
}

export const buildSetNodeBatchOperations = <T extends Node>(
  editor: Editor,
  updates: NodeBatchUpdate<T>[]
): BaseSetNodeOperation[] => {
  const ops: BaseSetNodeOperation[] = []

  for (const { at, props } of updates) {
    if (at.length === 0) {
      throw new Error('Cannot set properties on the root node!')
    }

    const node = Node.get(editor, at)
    const properties: Partial<Node> = {}
    const newProperties: Partial<Node> = {}
    const mutableProperties = properties as Record<string, unknown>
    const mutableNewProperties = newProperties as Record<string, unknown>
    let hasChanges = false

    for (const key in props) {
      if (key === 'children' || key === 'text') {
        continue
      }

      const value = props[key as keyof T]
      const nodeValue = node[key as keyof Node]

      if (value !== nodeValue) {
        hasChanges = true

        if (Object.prototype.hasOwnProperty.call(node, key)) {
          mutableProperties[key] = nodeValue
        }

        if (value != null) {
          mutableNewProperties[key] = value
        }
      }
    }

    if (hasChanges) {
      ops.push({
        type: 'set_node',
        path: at,
        properties,
        newProperties,
      })
    }
  }

  return ops
}

export const applySetNodeBatchOperations = (
  editor: Editor,
  ops: BaseSetNodeOperation[]
) => {
  if (ops.length === 0) {
    return
  }

  const dirtyPaths: Path[] = []
  const dirtyPathKeys = new Set<string>()
  const root = createBatchTreeNode()
  const opKeys = new Set<string>()

  const addDirtyPath = (path: Path) => {
    const key = path.join(',')

    if (!dirtyPathKeys.has(key)) {
      dirtyPathKeys.add(key)
      dirtyPaths.push(path)
    }
  }

  for (const op of ops) {
    if (op.path.length === 0) {
      throw new Error('Cannot set properties on the root node!')
    }

    const opKey = op.path.join(',')

    if (opKeys.has(opKey)) {
      throw new Error(
        `setNodesBatch does not support duplicate update paths. Duplicate path: [${op.path}]`
      )
    }

    opKeys.add(opKey)

    let branch = root

    for (const index of op.path) {
      let child = branch.children.get(index)

      if (!child) {
        child = createBatchTreeNode()
        branch.children.set(index, child)
      }

      branch = child
    }

    branch.op = op

    for (const dirtyPath of Path.levels(op.path)) {
      addDirtyPath(dirtyPath)
    }
  }

  Editor.withoutNormalizing(editor, () => {
    const nextChildren = editor.children.slice()
    let hasChanges = false

    for (const [index, branch] of root.children) {
      const child = editor.children[index]

      if (!child) {
        throw new Error(
          `Cannot apply batched set_node operations because top-level path [${index}] does not exist.`
        )
      }

      const nextChild = applyBatchToNode(child, branch)

      if (nextChild !== child) {
        nextChildren[index] = nextChild
        hasChanges = true
      }
    }

    if (hasChanges) {
      editor.children = nextChildren
    }

    updateDirtyPaths(editor, dirtyPaths)
    editor.operations.push(...(ops as any))

    if (!FLUSHING.get(editor)) {
      FLUSHING.set(editor, true)

      Promise.resolve().then(() => {
        FLUSHING.set(editor, false)
        editor.onChange()
        editor.operations = []
      })
    }
  })
}

export const setNodesBatch = <T extends Node>(
  editor: Editor,
  updates: NodeBatchUpdate<T>[]
) => {
  const ops = buildSetNodeBatchOperations(editor, updates)

  applySetNodeBatchOperations(editor, ops)
}
