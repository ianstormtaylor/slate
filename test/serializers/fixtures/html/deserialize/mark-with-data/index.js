
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
          case 'mark': {
            return {
              kind: 'mark',
              type: 'highlight',
              data: {
                backgroundColor: 'green',
              },
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
