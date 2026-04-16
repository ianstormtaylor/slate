import { Transforms } from '../interfaces/transforms'
import type { NodeTransforms } from '../interfaces/transforms/node'

export const unsetNodes: NodeTransforms['unsetNodes'] = (
  editor,
  props,
  options = {}
) => {
  const targetProps = Array.isArray(props) ? props : [props]

  const obj: any = {}

  for (const key of targetProps) {
    obj[key] = null
  }

  Transforms.setNodes(editor, obj, options)
}
