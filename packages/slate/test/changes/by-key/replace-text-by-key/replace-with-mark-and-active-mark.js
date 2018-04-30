/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { anchorKey, anchorOffset } = change.value
  change.replaceTextByKey(anchorKey, anchorOffset, 3, 'cat is cute', [
    { type: 'italic' },
  ])
}

export const input = (
  <value>
    <document>
      <paragraph>
        Meow,{' '}
        <b>
          <cursor />word.
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Meow,{' '}
        <i>
          <b>
            cat is cute<cursor />
          </b>
        </i>
        <b>d.</b>
      </paragraph>
    </document>
  </value>
)
