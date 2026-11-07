import { Editor, Node } from '../interfaces'
import { WithEditorFirstArg } from '../utils/types'

/** @ignore */
export const getSplitProperties: WithEditorFirstArg<
  Editor['getSplitProperties']
> = (editor, node) => Node.extractProps(node)
