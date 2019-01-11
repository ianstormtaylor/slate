import getSelectionFromDOM from './get-selection-from-dom'

export default function setSelectionFromDOM(window, editor, domSelection) {
  const selection = getSelectionFromDOM(window, editor, domSelection)
  editor.select(selection)
}
