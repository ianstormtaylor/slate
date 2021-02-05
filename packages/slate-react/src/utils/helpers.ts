import { DOMNode, isDOMNode } from '../utils/dom'
import { ReactEditor } from '../plugin/react-editor'

/**
 * Check if the target is editable and in the editor.
 */

export function hasEditableTarget(
  editor: ReactEditor,
  target: EventTarget | null
): target is DOMNode {
  return (
    isDOMNode(target) &&
    ReactEditor.hasDOMNode(editor, target, { editable: true })
  )
}

/**
 * Check if an event is overrided by a handler.
 */

export function isEventHandled<
  EventType extends React.SyntheticEvent<unknown, unknown>
>(event: EventType, handler?: (event: EventType) => void) {
  if (!handler) {
    return false
  }

  handler(event)
  return event.isDefaultPrevented() || event.isPropagationStopped()
}
