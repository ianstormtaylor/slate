/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>
              <paragraph>1</paragraph>
            </table_cell>
            <table_cell>
              <paragraph>2</paragraph>
            </table_cell>
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
              <paragraph>
                <cursor />
              </paragraph>
            </table_cell>
            <table_cell>
              <paragraph />
            </table_cell>
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)

// TODO: surely this is the wrong behavior.
// ideally, paragraph with "2" goes into second cell
export const output = (
  <value>
    <document>
      <table>
        <table_body>
          <table_row>
            <table_cell>
              <paragraph>1</paragraph>
              <table_cell>
                <paragraph>
                  2<cursor />
                </paragraph>
              </table_cell>
            </table_cell>
            <table_cell>
              <paragraph />
            </table_cell>
          </table_row>
        </table_body>
      </table>
    </document>
  </value>
)
