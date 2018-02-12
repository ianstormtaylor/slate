/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <table>
        <tr>
          <td>Col 0, Row 0</td>
          <td>Col 1, Row 0</td>
        </tr>
        <tr>
          <td>Col 0, Row 1</td>
          <td>Col 1, Row 1</td>
        </tr>
      </table>
      <quote>two</quote>
      <table>
        <tr>
          <td>Table2, Col 0, Row 0</td>
          <td>Table2, Col 1, Row 0</td>
        </tr>
        <tr>
          <td>Table2, Col 0, Row 1</td>
          <td>Table2, Col 1, Row 1</td>
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
          <td>Col 0, Row 0</td>
          <td>Col 1, Row 0</td>
        </tr>
        <tr>
          <td>Col 0, Row 1</td>
          <td>Col 1, Row 1</td>
        </tr>
      </table>
      <quote>two</quote>
      <table>
        <tr>
          <td>Table2, Col 0, Row 0</td>
          <td>Table2, Col 1, Row 0</td>
        </tr>
        <tr>
          <td>Table2, Col 0, Row 1</td>
          <td>Table2, Col 1, Row 1</td>
        </tr>
      </table>
      <paragraph>
        <cursor />rd
      </paragraph>
    </document>
  </value>
)
