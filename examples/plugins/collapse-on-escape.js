export default function CollapseOnEscape(options = {}) {
  return {
    onKeyDown(event, change, next) {
      const { value } = change
      const { selection } = value

      if (event.key === 'Escape' && selection.isExpanded) {
        change.moveToEnd()
      } else {
        return next()
      }
    },
  }
}
