
/**
 * The default Slate schema rules, which enforce the most basic constraints.
 *
 * @type {Array}
 */

const RULES = [
  {
    match: {
      kind: 'document'
    },
    validate: {
      anyOf: [
        { kind: 'block' }
      ]
    },
    transform: (transform, match, reason) => {
      return reason.value.reduce((tr, node) => {
        return tr.removeNodeByKey(node.key)
      }, transform)
    }
  },
  {
    match: {
      kind: 'block'
    },
    validate: {
      anyOf: [
        { kind: 'block' },
        { kind: 'inline' },
        { kind: 'text' },
      ]
    },
    transform: (transform, match, reason) => {
      return reason.value.reduce((tr, node) => {
        return tr.removeNodeByKey(node.key)
      }, transform)
    }
  },
  {
    match: {
      kind: 'inline'
    },
    validate: {
      anyOf: [
        { kind: 'inline' },
        { kind: 'text' },
      ]
    },
    transform: (transform, match, reason) => {
      return reason.value.reduce((tr, node) => {
        return tr.removeNodeByKey(node.key)
      }, transform)
    }
  },
  // {
  //   match: { isVoid: true },
  //   validate: {
  //     text: ' '
  //   },
  //   transform: (transform, node) => {
  //     const { state } = transform
  //     const range = state.selection.moveToRangeOf(node)
  //     return transform.delete().insertText(' ')
  //   }
  // },
  // {
  //   match: (object) => {
  //     return (
  //       object.kind == 'block' &&
  //       object.nodes.size == 1 &&
  //       object.nodes.first().isVoid
  //     )
  //   },
  //   invalid: true,
  //   transform: (transform, node) => {
  //     const child = node.nodes.first()
  //     const text =
  //     return transform
  //       .insertNodeBeforeNodeByKey(child.)
  //   }
  // }
]

/**
 * Export.
 *
 * @type {Array}
 */

export default RULES
