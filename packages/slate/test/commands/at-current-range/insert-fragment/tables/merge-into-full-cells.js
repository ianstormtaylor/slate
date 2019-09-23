/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>New 1</table_cell>
            <table_cell>New 2</table_cell>
          </table_row>
        </table_body>
      </table>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>
              {'Existing 1 '}
              <cursor />
            </table_cell>
            <table_cell>Existing 2</table_cell>
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)

// TODO: paste "Existing 2" before / after "New 2" in second cell?
export const output = (
  <value>
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>Existing 1 New 1</table_cell>
            <table_cell>
              New 2<cursor />
            </table_cell>
            <table_cell>Existing 2</table_cell>
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)
