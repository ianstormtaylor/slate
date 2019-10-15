/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    <table>
      <table_body>
        <table_row>
          <table_cell>
            <block>1</block>
          </table_cell>
          <table_cell>
            <block>2</block>
          </table_cell>
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
            <block>
              <cursor />
            </block>
          </table_cell>
          <table_cell>
            <block>
              <text />
            </block>
          </table_cell>
        </table_row>
      </table_body>
    </table>
  </value>
)

// TODO: surely this is the wrong behavior.
// ideally, paragraph with "2" goes into second cell
export const output = (
  <value>
    <table>
      <table_body>
        <table_row>
          <table_cell>
            <block>1</block>
            <table_cell>
              <block>
                2<cursor />
              </block>
            </table_cell>
          </table_cell>
          <table_cell>
            <block>
              <text />
            </block>
          </table_cell>
        </table_row>
      </table_body>
    </table>
  </value>
)

export const skip = true
