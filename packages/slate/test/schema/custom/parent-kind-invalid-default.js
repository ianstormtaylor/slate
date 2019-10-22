/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { object: 'block' },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <text />
        <inline>
          <text />
          <inline>one</inline>
          <text />
        </inline>
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <text />
        <inline>
          <text />
        </inline>
        <text />
      </block>
    </document>
  </value>
)
