import getSelectionFromDOM from './get-selection-from-dom'

/**
 * Looks at the DOM and generates the equivalent Slate Selection.
 *
 * @param {Window} window
 * @param {Editor} editor
 * @param {Selection} domSelection - The DOM's selection Object
 */

export default function setSelectionFromDOM(window, editor, domSelection) {
  const selection = getSelectionFromDOM(window, editor, domSelection)
  editor.select(selection)
}
