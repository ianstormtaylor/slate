/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    heading: {},
    quote: {
      nodes: [
        {
          match: [
            {
              type: 'heading',
              data: { level: v => v === 1 },
            },
          ],
          min: 1,
          max: 1,
        },
        {
          match: [
            {
              type: 'heading',
              data: { level: v => v === 2 },
            },
          ],
          min: 1,
          max: 1,
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block type="heading" data={{ level: 1 }}>
          <text />
        </block>
        <block type="heading" data={{ level: 2 }}>
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
        <block type="heading" data={{ level: 1 }}>
          <text />
        </block>
        <block type="heading" data={{ level: 2 }}>
          <text />
        </block>
      </quote>
    </document>
  </value>
)
