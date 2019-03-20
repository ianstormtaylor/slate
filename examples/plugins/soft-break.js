export default function SoftBreak(options = {}) {
  return {
    onKeyDown(event, editor, next) {
      if (event.key === 'Enter') {
        editor.insertText('\n')
      } else {
        next()
      }
    },
  }
}
