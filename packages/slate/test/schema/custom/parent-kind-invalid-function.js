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
        <text />
        <link>
          <text />
          <link>one</link>
          <text />
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text />
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
