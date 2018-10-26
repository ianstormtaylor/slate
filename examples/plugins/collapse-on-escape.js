export default function CollapseOnEscape(options = {}) {
  return {
    onKeyDown(event, editor, next) {
      const { value } = editor
      const { selection } = value

      if (event.key === 'Escape' && selection.isExpanded) {
        editor.moveToEnd()
      } else {
        return next()
      }
    },
  }
}
