
export default {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'p': {
            return {
              kind: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes)
            }
          }
          case 'blockquote': {
            return {
              kind: 'block',
              type: 'quote',
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
