/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      parent: { object: 'document' },
      normalize: (editor, { code, node }) => {
        if (code == 'parent_object_invalid') {
          editor.unwrapNodeByKey(node.key)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)
