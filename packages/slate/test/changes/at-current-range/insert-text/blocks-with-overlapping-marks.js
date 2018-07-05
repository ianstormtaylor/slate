/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('is ')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <i>Cat</i>
        </b>
      </paragraph>
      <paragraph>
        <b>
          <cursor />Cute
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          <i>Cat</i>
        </b>
      </paragraph>
      <paragraph>
        <b>
          is <cursor />Cute
        </b>
      </paragraph>
    </document>
  </value>
)
