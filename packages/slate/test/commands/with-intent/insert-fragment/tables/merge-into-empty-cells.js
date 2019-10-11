/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>1</table_cell>
            <table_cell>2</table_cell>
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
              <cursor />
            </table_cell>
            <table_cell />
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)

// TODO: paste "2" into second cell instead of creating new one?
export const output = (
  <value>
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>1</table_cell>
            <table_cell>
              2<cursor />
            </table_cell>
            <table_cell />
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)

export const skip = true
