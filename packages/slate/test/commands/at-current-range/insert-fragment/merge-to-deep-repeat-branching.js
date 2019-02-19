/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <div>
        <paragraph>F1</paragraph>
        <div>
          <paragraph>F2</paragraph>
        </div>
      </div>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <div>
        <paragraph>D1</paragraph>
        <div>
          <paragraph>
            D2<cursor />
          </paragraph>
        </div>
      </div>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <div>
        <paragraph>D1</paragraph>
        <div>
          <paragraph>D2F1</paragraph>
          <div>
            <paragraph>
              F2<cursor />
            </paragraph>
          </div>
        </div>
      </div>
    </document>
  </value>
)
