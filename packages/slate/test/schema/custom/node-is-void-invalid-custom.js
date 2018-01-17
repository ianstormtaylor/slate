/** @jsx h */

import { SchemaViolations } from '../../..'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      isVoid: false,
      normalize: (change, reason, { node }) => {
        if (reason == SchemaViolations.NodeIsVoidInvalid) {
          change.removeNodeByKey(node.key, 'paragraph')
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <block type="paragraph" isVoid />
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
