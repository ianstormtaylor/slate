/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { types: ['list'] },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <item />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
