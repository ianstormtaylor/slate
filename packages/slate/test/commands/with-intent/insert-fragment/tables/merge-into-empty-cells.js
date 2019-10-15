/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <table>
        <table_body>
          <table_row>
            <table_cell>1</table_cell>
            <table_cell>2</table_cell>
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
              <cursor />
            </table_cell>
            <table_cell />
          </table_row>
        </table_body>
      </table>
    
  </value>
)

// TODO: paste "2" into second cell instead of creating new one?
export const output = (
  <value>
    
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
    
  </value>
)

export const skip = true
