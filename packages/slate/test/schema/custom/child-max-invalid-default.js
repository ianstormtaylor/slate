/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'title' }],
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
        <block type="title">One</block>
        <block type="title">Two</block>
        <block>
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
        <block type="title">One</block>
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)
