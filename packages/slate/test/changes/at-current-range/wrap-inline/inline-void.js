/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline({
    type: 'link',
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <emoji>
          <cursor />{' '}
        </emoji>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <emoji>
            <cursor />{' '}
          </emoji>
        </link>
      </paragraph>
    </document>
  </value>
)
