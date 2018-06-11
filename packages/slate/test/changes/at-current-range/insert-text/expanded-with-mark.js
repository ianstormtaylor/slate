/** @jsx h */

import h from '../../../helpers/h'

/*
 * This test makes sure a normalization happens on insertText on expandedRange
 */

export default function(change) {
  change.insertText('a')
  change.insertText('b')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />lorem
        </b>
        ipsum
      </paragraph>
      <paragraph>
        ipsum<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          ab<cursor />
        </b>
      </paragraph>
    </document>
  </value>
)
