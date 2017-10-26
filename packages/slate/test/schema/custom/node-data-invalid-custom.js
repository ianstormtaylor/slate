/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == 'value'
      },
      normalize: (change, reason, { node, key }) => {
        if (reason == 'node_data_invalid') {
          change.setNodeByKey(node.key, { data: { thing: 'value' }})
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph thing="value" />
    </document>
  </state>
)
