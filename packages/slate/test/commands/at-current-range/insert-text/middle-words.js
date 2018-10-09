/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText(' a few words ')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w a few words <cursor />ord
      </paragraph>
    </document>
  </value>
)
