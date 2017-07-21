
export default {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName) {
          case 'p': {
            return {
              kind: 'block',
              type: 'paragraph',
              data: { key: 'value' },
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
