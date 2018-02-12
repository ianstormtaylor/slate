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
        <quote>
          <image key="a">' '</image>
          <paragraph>word1</paragraph>
          <paragraph> another1</paragraph>
        </quote>
        <paragraph>begin1</paragraph>
      </quote>
      <paragraph />

      <quote>
        <paragraph>end1</paragraph>
        <quote>
          <paragraph>word2</paragraph>
          <paragraph> another2</paragraph>
          <image key="b">' '</image>
        </quote>
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
