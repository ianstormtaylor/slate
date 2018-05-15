/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText(' a few words')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word a few words<cursor />
      </paragraph>
    </document>
  </value>
)
