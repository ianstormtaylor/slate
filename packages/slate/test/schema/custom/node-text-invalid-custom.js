/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
      normalize: (change, reason, { node }) => {
        if (reason == 'node_text_invalid') {
          node.nodes.forEach(n => change.removeNodeByKey(n.key))
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        invalid
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)
