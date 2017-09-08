
export default {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
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
