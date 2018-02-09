/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <table>
        <tr>
          <td>
            <image>" "</image>
          </td>
        </tr>
      </table>
      <quote>two</quote>
      <table>
        <tr>
          <td>
            <image>" "</image>
          </td>
        </tr>
      </table>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wo</paragraph>
      <table>
        <tr>
          <td>
            <image> " "</image>
          </td>
        </tr>
      </table>
      <quote>two</quote>
      <table>
        <tr>
          <td>
            <image>" "</image>
          </td>
        </tr>
      </table>
      <paragraph>
        <cursor />rd
      </paragraph>
    </document>
  </value>
)
