
export default [
  {
    deserialize(el, next) {
      switch (el.tagName) {
        case 'p': {
          return {
            kind: 'block',
            type: 'paragraph',
            isVoid: true
          }
        }
      }
    }
  }
]
