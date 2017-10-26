/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'], max: 1 },
      ],
      normalize: (change, reason, { node, child, index }) => {
        if (reason == 'child_unknown') {
          const previous = node.getPreviousSibling(child.key)
          const offset = previous.nodes.size
          child.nodes.forEach((n, i) => change.moveNodeByKey(n.key, previous.key, offset + i, { normalize: false }))
          change.removeNodeByKey(child.key)
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          onetwo
        </paragraph>
      </quote>
    </document>
  </state>
)
