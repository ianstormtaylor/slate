import { NodeTransforms } from './transforms/node'
import { Transforms } from './transforms'

export const unsetNodes: NodeTransforms['unsetNodes'] = (
  editor,
  props,
  options = {}
) => {
  if (!Array.isArray(props)) {
    props = [props]
  }

  const obj = {}

  for (const key of props) {
    obj[key] = null
  }

  Transforms.setNodes(editor, obj, options)
}
