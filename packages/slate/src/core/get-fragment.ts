import { Editor, Node } from '../interfaces'
import { WithEditorFirstArg } from '../utils'

export const getFragment: WithEditorFirstArg<
  Editor['getFragment']
> = editor => {
  const { selection } = editor

  if (selection) {
    return Node.fragment(editor, selection)
  }
  return []
}
