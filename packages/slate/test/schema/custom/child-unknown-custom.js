/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          max: 1,
        },
      ],
      normalize: (change, { code, node, child }) => {
        if (code == 'child_unknown') {
          const previous = node.getPreviousSibling(child.key)
          const offset = previous.nodes.size

          child.nodes.forEach((n, i) =>
            change.moveNodeByKey(n.key, previous.key, offset + i)
          )

          change.removeNodeByKey(child.key)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>onetwo</paragraph>
      </quote>
    </document>
  </value>
)
