/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteNodesBetween('a', 'b')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>begin</paragraph>
        <paragraph>
          <emoji key="a">' '</emoji>
          begin1
        </paragraph>
      </quote>
      <paragraph />

      <quote>
        <paragraph>end1</paragraph>
        <paragraph>
          another2
          <emoji key="b">' '</emoji>
        </paragraph>
        <paragraph>end</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>begin</paragraph>
      </quote>
      <quote>
        <paragraph>end</paragraph>
      </quote>
    </document>
  </value>
)
