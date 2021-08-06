import { ReactEditor } from '../..'
import { EDITOR_TO_RESTORE_DOM } from '../../utils/weak-maps'

export function restoreDOM(editor: ReactEditor) {
  try {
    const onRestoreDOM = EDITOR_TO_RESTORE_DOM.get(editor)
    if (onRestoreDOM) {
      onRestoreDOM()
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}
