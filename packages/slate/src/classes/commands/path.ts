import { produce } from 'immer'
import { Editor, Fragment, Mark, Element, Text, Node, Path } from '../..'

class PathCommands {
  /**
   * Add a mark to the node at a path.
   */

  addMarkAtPath(this: Editor, path: Path, mark: Mark): void {
    const { value } = this
    const leaf = Node.leaf(value, path)

    if (!Mark.exists(mark, leaf.marks)) {
      this.apply({ type: 'add_mark', path, mark })
    }
  }

  /**
   * Insert a fragment starting at a path.
   */

  insertFragmentAtPath(this: Editor, path: Path, fragment: Fragment): void {
    const parentPath = path.slice(0, -1)
    let i = path[path.length - 1]

    this.withoutNormalizing(() => {
      for (const node of fragment.nodes) {
        const childPath = parentPath.concat(i)
        i++
        this.insertNodeAtPath(childPath, node)
      }
    })
  }

  /**
   * Insert a node at a path.
   */

  insertNodeAtPath(this: Editor, path: Path, node: Node): void {
    this.apply({ type: 'insert_node', path, node })
  }

  /**
   * Merge the leaf block at a path with the previous leaf block.
   */

  mergeBlockAtPath(this: Editor, path: Path): void {
    this.withoutNormalizing(() => {
      const { value } = this
      const closestBlock = this.getClosestBlock(path)
      const prevBlock = this.getPreviousLeafBlock(path)

      if (!closestBlock) {
        throw new Error(
          `Cannot merge the leaf block above path ${path} because there isn't one.`
        )
      }

      if (!prevBlock) {
        throw new Error(
          `Cannot merge the block above path ${path} with the previous leaf block because there isn't one.`
        )
      }

      const [, blockPath] = closestBlock
      const [, prevPath] = prevBlock
      const newPath = Path.next(prevPath)
      const commonAncestorPath = Path.common(blockPath, prevPath)

      this.moveNodeAtPath(blockPath, newPath)
      this.mergeNodeAtPath(newPath)

      for (const [ancestor, ancestorPath] of Node.ancestors(value, blockPath)) {
        if (
          Path.equals(ancestorPath, commonAncestorPath) ||
          ancestor.nodes.length !== 1
        ) {
          break
        }

        this.removeNodeAtPath(ancestorPath)
      }
    })
  }

  /**
   * Merge the node at a path with the previous node.
   */

  mergeNodeAtPath(this: Editor, path: Path): void {
    if (path.length === 0) {
      throw new Error(`Cannot perform a merge on the top-level node.`)
    }

    if (path[path.length - 1] === 0) {
      throw new Error(
        `Cannot merge the node at path ${path} with the previous sibling because there isn't one.`
      )
    }

    const { value } = this
    const prevPath = Path.previous(path)
    const node = Node.get(value, path)
    const prevNode = Node.get(value, prevPath)

    if (Text.isText(node) && Text.isText(prevNode)) {
      const { text, marks, ...properties } = node
      const position = prevNode.text.length
      this.apply({
        type: 'merge_node',
        path,
        position,
        target: null,
        properties,
      })
    } else if (Element.isElement(node) && Element.isElement(prevNode)) {
      const { nodes, ...properties } = node
      const position = prevNode.nodes.length
      this.apply({
        type: 'merge_node',
        path,
        position,
        target: null,
        properties,
      })
    } else {
      throw new Error(
        `Cannot merge the node at path ${path} with the previous sibling because it is not the same kind: ${node} ${prevNode}`
      )
    }
  }

  /**
   * Move a node at a path to a new path.
   */

  moveNodeAtPath(this: Editor, path: Path, newPath: Path): void {
    const { value } = this
    const prevPath = Path.previous(path)
    const parentPath = Path.parent(path)
    const newIndex = newPath[newPath.length - 1]

    if (!Node.has(value, path)) {
      throw new Error(
        `Cannot move the node at path ${path} because it does not exist.`
      )
    }

    if (!Node.has(value, parentPath)) {
      throw new Error(
        `Cannot move the node at path ${path} to the new parent at path ${parentPath} because the parent does not exist.`
      )
    }

    if (newIndex !== 0 && !Node.has(value, prevPath)) {
      throw new Error(
        `Cannot move the node at path ${path} to ${newPath} because the index is out of range.`
      )
    }

    this.apply({
      type: 'move_node',
      path,
      newPath,
    })
  }

  /**
   * Normalize a node at a path, returning it to a valid state if it is
   * currently invalid.
   */

  normalizeNodeAtPath(this: Editor, path: Path): void {}

  /**
   * Remove all of the children from the node at a path.
   */

  removeChildrenAtPath(this: Editor, path: Path): void {
    const { value } = this
    const parent = Node.ancestor(value, path)

    this.withoutNormalizing(() => {
      const childPath = path.concat([0])

      for (let i = 0; i < parent.nodes.length; i++) {
        this.removeNodeAtPath(childPath)
      }
    })
  }

  /**
   * Remove a mark on the node at a path.
   */

  removeMarkAtPath(this: Editor, path: Path, mark: Mark): void {
    const { value } = this
    const leaf = Node.leaf(value, path)

    if (Mark.exists(mark, leaf.marks)) {
      this.apply({ type: 'remove_mark', path, mark })
    }
  }

  /**
   * Remove the node at a path.
   */

  removeNodeAtPath(this: Editor, path: Path): void {
    const { value } = this
    const node = Node.get(value, path)
    this.apply({ type: 'remove_node', path, node })
  }

  /**
   * Remove the parent node of a path.
   */

  removeParentAtPath(this: Editor, path: Path): void {
    const { value } = this
    const parent = Node.parent(value, path)
    const parentPath = Path.parent(path)
    this.apply({ type: 'remove_node', path: parentPath, node: parent })
  }

  /**
   * Replace the node at a path with a new node.
   */

  replaceNodeAtPath(this: Editor, path: Path, node: Node): void {
    this.withoutNormalizing(() => {
      this.removeNodeAtPath(path)
      this.insertNodeAtPath(path, node)
    })
  }

  /**
   * Set new properties on the node at a path.
   */

  setNodeAtPath(this: Editor, path: Path, props: {}): void {
    if (path.length === 0) {
      this.setValue(props)
      return
    }

    const { value } = this
    const node = Node.get(value, path)
    const newProps = {}
    const oldProps = {}
    let isChange = true

    for (const k in props) {
      // Disallow setting restricted properties that should use the editor
      // methods that result in more semantic operations being applied.
      if (Element.isElement(node) && k === 'nodes') {
        throw new Error(
          `Cannot set the \`nodes\` property of an element node at path ${path}. You must use the node-specific editor methods instead like \`editor.insertNodeAtPath\`, \`editor.removeNodeAtPath\`, etc.`
        )
      }

      if (Text.isText(node) && k === 'text') {
        throw new Error(
          `Cannot set the \`text\` property of a text node at path ${path}. You must use the text-specific editor methods instead like \`editor.insertTextAtPath\`, \`editor.removeTextAtPath\`, etc.`
        )
      }

      if (Text.isText(node) && k === 'marks') {
        throw new Error(
          `Cannot set the \`marks\` property of a text node at path ${path}. You must use the text-specific editor methods instead like \`editor.addMarkAtPath\`, \`editor.removeMarkAtPath\`, etc.`
        )
      }

      if (props[k] !== node[k]) {
        isChange = true
        newProps[k] = props[k]
        oldProps[k] = node[k]
      }
    }

    // PERF: If no properties have changed don't apply an operation at all.
    if (!isChange) {
      return
    }

    this.apply({
      type: 'set_node',
      path,
      properties: oldProps,
      newProperties: newProps,
    })
  }

  /**
   * Set new properties on the node at a path.
   */

  setMarkAtPath(
    this: Editor,
    path: Path,
    mark: Partial<Mark>,
    props: {}
  ): void {
    const { value } = this
    const node = Node.leaf(value, path)
    const match = node.marks.find(m => Mark.matches(m, mark))

    if (match == null) {
      throw new Error(
        `Cannot set new properties on mark ${mark} at path ${path} because the mark does not exist.`
      )
    }

    const newProps = {}
    let isChange = true

    for (const k in props) {
      if (props[k] !== match[k]) {
        isChange = true
        newProps[k] = props[k]
      }
    }

    // PERF: If no properties have changed don't apply an operation at all.
    if (!isChange) {
      return
    }

    this.apply({
      type: 'set_mark',
      path,
      properties: match,
      newProperties: newProps,
    })
  }

  /**
   * Replace a mark on the text node at a path.
   */

  replaceMarkAtPath(this: Editor, path: Path, before: Mark, after: Mark): void {
    this.withoutNormalizing(() => {
      this.removeMarkAtPath(path, before)
      this.addMarkAtPath(path, after)
    })
  }

  /**
   * Replace all of the text in a node at a path.
   */

  replaceTextAtPath(this: Editor, path: Path, text: string): void {
    this.withoutNormalizing(() => {
      const { value } = this
      const node = Node.leaf(value, path)
      const point = { path, offset: 0 }
      this.removeTextAtPoint(point, node.text.length)
      this.insertTextAtPoint(point, text)
    })
  }

  /**
   * Split the node at a path at a specific position in the node. If the node is
   * a text node, `position` refers to a string offset. If the node is an
   * element node, `position` refers to the index of its children.
   *
   * If you're looking to split from an ancestor all the way down to a leaf text
   * node, you likely want `splitNodeAtPoint` instead.
   */

  splitNodeAtPath(
    this: Editor,
    path: Path,
    position: number,
    options: { target?: number } = {}
  ): void {
    if (path.length === 0) {
      throw new Error(`Cannot split the top-level node in the document.`)
    }

    const { target = null } = options
    const { value } = this
    const node = Node.get(value, path)
    let properties

    if (Text.isText(node)) {
      const { text, marks, ...rest } = node
      properties = rest
    } else {
      const { nodes, ...rest } = node
      properties = rest
    }

    this.apply({
      type: 'split_node',
      path,
      position,
      target,
      properties,
    })
  }

  /**
   * Unwrap all of the children of a node, by removing the node and replacing it
   * in the tree with its children.
   */

  unwrapChildrenAtPath(this: Editor, path: Path): void {
    const { value } = this
    const node = Node.get(value, path)

    if (Text.isText(node)) {
      throw new Error(
        `Cannot unwrap children from the node at ${path} because it is a text node and has no children.`
      )
    }

    this.withoutNormalizing(() => {
      const parentPath = Path.parent(path)
      const index = path[path.length - 1]

      for (let i = 0; i < node.nodes.length; i++) {
        const targetPath = path.concat(i)
        const newPath = parentPath.concat(index + i)
        this.moveNodeAtPath(targetPath, newPath)
      }

      this.removeNodeAtPath(path)
    })
  }

  /**
   * Unwrap a single node from its parent.
   *
   * If the node is surrounded with siblings, its parent will be split. If the
   * node is the only child, the parent is removed, and simply replaced by the
   * node itself.
   */

  unwrapNodeAtPath(this: Editor, path: Path): void {
    const { value } = this
    const parent = Node.parent(value, path)
    const parentPath = Path.parent(path)
    const index = path[path.length - 1]
    const parentIndex = parentPath[parentPath.length - 1]
    const grandPath = Path.parent(parentPath)
    const isFirst = index === 0
    const isLast = index === parent.nodes.length - 1

    this.withoutNormalizing(() => {
      let targetPath = path
      let newPath = grandPath.concat(parentIndex + 1)

      // If the parent has multiple nodes and we're unwrapping the first one, we
      // will just move it before the parent instead.
      if (parent.nodes.length > 1 && isFirst) {
        newPath = grandPath.concat(parentIndex)
      }

      // If there are multiple children, and we're unwrapping one of the middle
      // children, we need to split the parent in half first.
      if (parent.nodes.length > 1 && !isFirst && !isLast) {
        targetPath = produce(path, p => {
          p[parentPath.length - 1] += 1
          p[targetPath.length - 1] = 0
        })

        this.splitNodeAtPath(parentPath, index)
      }

      this.moveNodeAtPath(targetPath, newPath)

      // If there was only one child, the parent gets removed.
      if (parent.nodes.length === 1) {
        this.removeNodeAtPath(parentPath)
      }
    })
  }

  /**
   * Wrap the node at a path in a new parent node.
   */

  wrapNodeAtPath(this: Editor, path: Path, element: Element): void {
    this.withoutNormalizing(() => {
      this.insertNodeAtPath(path, element)
      const nextPath = Path.next(path)
      const childPath = path.concat(0)
      this.moveNodeAtPath(nextPath, childPath)
    })
  }
}

export default PathCommands
