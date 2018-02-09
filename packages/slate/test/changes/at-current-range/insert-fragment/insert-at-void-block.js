/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>two</quote>
      <table>
        <tr>
          <td>
            <paragraph>"cat"</paragraph>
          </td>
        </tr>
      </table>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>wo</paragraph>
      <image>
        <cursor />{' '}
      </image>
      <paragraph>rd</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wo</paragraph>
      <quote>two</quote>
      <table>
        <tr>
          <td>
            <paragraph>
              <cursor />"cat"
            </paragraph>
          </td>
        </tr>
      </table>
      <image>' '</image>
      <paragraph>rd</paragraph>
    </document>
  </value>
)
