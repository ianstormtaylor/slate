/** @jsx h */

import { SchemaViolations } from '../../..'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: [{ type: 'bold' }],
      normalize: (change, reason, { node }) => {
        if (reason == SchemaViolations.NodeMarkInvalid) {
          node.nodes.forEach(n => change.removeNodeByKey(n.key))
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <i>two</i> three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
