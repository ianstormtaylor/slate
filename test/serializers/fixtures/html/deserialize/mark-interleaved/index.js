
export default {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName) {
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
          case 'strong': {
            return {
              kind: 'mark',
              type: 'bold',
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
