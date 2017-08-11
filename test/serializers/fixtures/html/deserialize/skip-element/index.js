
export default {
  rules: [
    {
      deserialize(el, next) {
        if (el.tagName == 'div') {
          return null
        }
      }
    },
    {
      deserialize(el, next) {
        if (el.tagName == 'hr') {
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
