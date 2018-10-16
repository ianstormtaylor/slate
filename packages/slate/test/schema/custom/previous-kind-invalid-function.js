/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      previous: [{ object: o => o === 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <quote>
          <text />
        </quote>
        <image>
          <text />
        </image>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <image>
          <text />
        </image>
      </paragraph>
    </document>
  </value>
)
