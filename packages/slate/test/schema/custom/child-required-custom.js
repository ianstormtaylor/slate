/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'], min: 2 },
      ],
      normalize: (change, reason, { node, index }) => {
        if (reason == 'child_required') {
          change.insertNodeByKey(node.key, index, { object: 'block', type: 'paragraph' })
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
      </quote>
    </document>
  </value>
)
