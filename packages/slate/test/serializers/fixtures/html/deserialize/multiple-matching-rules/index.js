
export default {
  rules: [
    {
      deserialize(el, next) {
        return {
          kind: 'block',
          type: 'one'
        }
      }
    },
    {
      deserialize(el, next) {
        return {
          kind: 'block',
          type: 'two'
        }
      }
    }
  ]
}
