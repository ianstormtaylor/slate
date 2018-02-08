/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock(Infinity)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <paragraph>
            wo<cursor />rd
          </paragraph>
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <paragraph>wo</paragraph>
        </paragraph>
      </paragraph>
      <paragraph>
        <paragraph>
          <paragraph>
            <cursor />rd
          </paragraph>
        </paragraph>
      </paragraph>
    </document>
  </value>
)
