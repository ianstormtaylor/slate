export default function SoftBreak(options = {}) {
  return {
    onKeyDown(event, change, next) {
      if (event.key === 'Enter') {
        change.insertText('\n')
      } else {
        next()
      }
    },
  }
}
