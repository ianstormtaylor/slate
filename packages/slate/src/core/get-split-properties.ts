import { Editor, Node } from '../interfaces'
import { WithEditorFirstArg } from '../utils/types'

export const getSplitProperties: WithEditorFirstArg<
  Editor['getSplitProperties']
> = (editor, node) => Node.extractProps(node)
