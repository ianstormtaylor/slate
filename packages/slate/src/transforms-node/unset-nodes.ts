import { Transforms } from '../interfaces/transforms'
import type { NodeTransforms } from '../interfaces/transforms/node'

export const unsetNodes: NodeTransforms['unsetNodes'] = (
  editor,
  props,
  options = {}
) => {
  if (!Array.isArray(props)) {
    props = [props]
  }

  const obj: any = {}

  for (const key of props) {
    obj[key] = null
  }

  Transforms.setNodes(editor, obj, options)
}
