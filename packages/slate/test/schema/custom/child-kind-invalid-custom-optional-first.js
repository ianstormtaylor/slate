/** @jsx h */

import { SchemaViolations } from '../../..'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { objects: ['block'], types: ['image'], min: 0, max: 1 },
        { objects: ['block'], types: ['paragraph'], min: 1 }
      ],
      normalize: (change, reason, { node, child }) => {
        if (reason == SchemaViolations.ChildObjectInvalid) {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <quote>
        text
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          text
        </paragraph>
      </quote>
    </document>
  </value>
)
