/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      isVoid: false,
      normalize: (change, reason, { node }) => {
        if (reason == 'node_is_void_invalid') {
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
