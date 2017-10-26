/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { kinds: ['block'] },
      normalize: (change, reason, { node }) => {
        if (reason == 'parent_kind_invalid') {
          change.unwrapNodeByKey(node.key)
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><link>one</link></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>one</link>
      </paragraph>
    </document>
  </state>
)
