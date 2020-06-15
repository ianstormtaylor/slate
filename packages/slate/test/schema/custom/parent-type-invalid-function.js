/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { type: t => t === 'list' },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <item>
          <text />
        </item>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)
