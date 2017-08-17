
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
          case 'a': {
            return {
              kind: 'inline',
              type: 'link',
              nodes: next(el.childNodes)
            }
          }
          case 'b': {
            return {
              kind: 'inline',
              type: 'hashtag',
              nodes: next(el.childNodes)
            }
          }
        }
      }
    }
  ]
}
