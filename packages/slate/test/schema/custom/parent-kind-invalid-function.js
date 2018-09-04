/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { object: o => o === 'block' },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <link>one</link>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link />
      </paragraph>
    </document>
  </value>
)
