/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      next: [{ object: 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <image>
          <text />
        </image>
        <quote>
          <text />
        </quote>
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
