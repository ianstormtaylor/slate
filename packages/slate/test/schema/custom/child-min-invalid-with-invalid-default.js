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
        <block>
          <text />
        </block>
        <block type="invalid">
          <text />
        </block>
        <block>
          <text />
        </block>
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
        <block>
          <text />
        </block>
        <block>
          <text />
        </block>
        <block type="final">
          <text />
        </block>
      </quote>
    </document>
  </value>
)
