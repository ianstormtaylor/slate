/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    title: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'title' }],
          min: 1,
          max: 1,
        },
        {
          match: [{ type: 'paragraph' }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block type="title">
          <text />
        </block>
        <block type="title">
          <text />
        </block>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <block type="title">
          <text />
        </block>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
