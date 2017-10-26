/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { kinds: ['block'] },
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
      <paragraph />
    </document>
  </state>
)
