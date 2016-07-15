
export default [
  {
    deserialize(el, next) {
      switch (el.tagName) {
        case 'p': {
          return {
            kind: 'block',
            type: 'paragraph',
            nodes: next(el.children)
          }
        }
        case 'a': {
          return {
            kind: 'inline',
            type: 'link',
            isVoid: true
          }
        }
      }
    }
  }
]
