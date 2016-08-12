
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
      nodes: {
        anyOf: [
          { kind: 'block' }
        ]
      }
    },
    transform: (transform, node) => {
      return node.nodes
        .filter(child => child.kind != 'block')
        .reduce((tr, child) => tr.removeNodeByKey(child.key), transform)
    }
  },
  // {
  //   match: { kind: 'block' },
  //   nodes: {
  //     anyOf: [
  //       { kind: 'block' },
  //       { kind: 'inline' },
  //       { kind: 'text' },
  //     ]
  //   },
  //   transform: (transform, node) => {
  //     return node
  //       .filterChildren(child => {
  //         return (
  //           child.kind != 'block' ||
  //           child.kind != 'inline' ||
  //           child.kind != 'text'
  //         )
  //       })
  //       .reduce((transform, child) => {
  //         return transform.removeNodeByKey(child.key)
  //       })
  //   }
  // },
  // {
  //   match: { kind: 'inline' },
  //   nodes: {
  //     anyOf: [
  //       { kind: 'inline' },
  //       { kind: 'text' }
  //     ]
  //   },
  //   transform: (transform, node) => {
  //     return node
  //       .filterChildren(child => {
  //         return child.kind != 'inline' || child.kind != 'text'
  //       })
  //       .reduce((transform, child) => {
  //         return transform.removeNodeByKey(child.key)
  //       })
  //   }
  // },
  // {
  //   match: { isVoid: true },
  //   text: ' ',
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
