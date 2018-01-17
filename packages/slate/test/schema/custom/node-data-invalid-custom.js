/** @jsx h */

import { SchemaViolations } from '../../..'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == 'value'
      },
      normalize: (change, reason, { node, key }) => {
        if (reason == SchemaViolations.NodeDataInvalid) {
          change.setNodeByKey(node.key, { data: { thing: 'value' }})
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="value" />
    </document>
  </value>
)
