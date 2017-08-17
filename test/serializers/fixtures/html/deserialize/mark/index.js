
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
          case 'em': {
            return {
              kind: 'mark',
              type: 'italic',
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
