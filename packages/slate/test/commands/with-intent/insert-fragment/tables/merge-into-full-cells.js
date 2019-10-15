/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <table>
        <table_body>
          <table_row>
            <table_cell>New 1</table_cell>
            <table_cell>New 2</table_cell>
          </table_row>
        </table_body>
      </table>
    
  )
}

export const input = (
  <value>
    
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
    
  </value>
)

// TODO: paste "Existing 2" before / after "New 2" in second cell?
export const output = (
  <value>
    
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
    
  </value>
)

export const skip = true
