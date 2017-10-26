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
          change.insertNodeByKey(node.key, index, { kind: 'block', type: 'paragraph' })
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph />
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph />
        <paragraph />
      </quote>
    </document>
  </state>
)
