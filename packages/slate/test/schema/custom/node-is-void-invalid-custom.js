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
  <state>
    <document>
      <block type="paragraph" isVoid />
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
