/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<b>
          or<cursor />
        </b>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<b>
          ora<cursor />
        </b>d
      </paragraph>
    </document>
  </value>
)
