import { Editor } from '../interfaces/editor'
import { WithEditorFirstArg } from '../utils/types'

export const shouldNormalize: WithEditorFirstArg<Editor['shouldNormalize']> = (
  editor,
  { iteration, initialDirtyPathsLength }
) => {
  const maxIterations = initialDirtyPathsLength * 42 // HACK: better way?

  if (iteration > maxIterations) {
    return editor.onError({
      key: 'shouldNormalize',
      message: `Could not completely normalize the editor after ${maxIterations} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.`,
      data: { iteration, maxIterations },
      recovery: false,
    })
  }

  return true
}
