/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: ['bold'],
      normalize: (change, reason, { node }) => {
        if (reason == 'node_mark_invalid') {
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
        one <i>two</i> three
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
