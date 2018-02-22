/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceNodeByKey('a', {
    object: 'inline',
    type: 'emoji',
    isVoid: true,
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        one{' '}
        <link key="a">
          two<cursor />
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one{' '}
        <emoji>
          <cursor />
        </emoji>
      </paragraph>
    </document>
  </value>
)
