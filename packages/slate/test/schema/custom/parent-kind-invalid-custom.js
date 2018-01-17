/** @jsx h */

import { SchemaViolations } from '../../..'
import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { objects: ['block'] },
      normalize: (change, reason, { node }) => {
        if (reason == SchemaViolations.ParentObjectInvalid) {
          change.unwrapNodeByKey(node.key)
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link><link>one</link></link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
      </paragraph>
    </document>
  </value>
)
