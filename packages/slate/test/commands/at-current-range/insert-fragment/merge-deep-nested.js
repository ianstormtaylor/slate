/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <code>
        <quote>
          <paragraph>2</paragraph>
          <paragraph>3</paragraph>
        </quote>
      </code>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <code>
          <quote>
            <paragraph>
              1<cursor />
            </paragraph>
          </quote>
        </code>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <code>
          <quote>
            <paragraph>12</paragraph>
            <paragraph>
              3<cursor />
            </paragraph>
          </quote>
        </code>
      </paragraph>
    </document>
  </value>
)
