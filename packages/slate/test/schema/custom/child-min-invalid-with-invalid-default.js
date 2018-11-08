/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          min: 2,
        },
        {
          match: [{ type: 'final' }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
        <block type="invalid">
          <text />
        </block>
        <paragraph>
          <text />
        </paragraph>
        <block type="final">
          <text />
        </block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
        <block type="final">
          <text />
        </block>
      </quote>
    </document>
  </value>
)
