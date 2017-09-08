
export default {
  rules: [
    {
      deserialize(el, next) {
        if (el.tagName.toLowerCase() == 'div') {
          return null
        }
      }
    },
    {
      deserialize(el, next) {
        if (el.tagName.toLowerCase() == 'hr') {
          return {
            kind: 'block',
            type: 'divider',
            isVoid: true,
          }
        }
      }
    },
    {
      deserialize(el, next) {
        return {
          kind: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes),
        }
      }
    },
  ]
}
