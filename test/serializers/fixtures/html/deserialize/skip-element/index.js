
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
        return {
          kind: 'block',
          type: 'paragraph',
        }
      }
    },
  ]
}
