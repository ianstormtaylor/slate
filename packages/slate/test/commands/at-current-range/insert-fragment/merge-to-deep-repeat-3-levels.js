/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <div>
        <div>
          <div>
            <paragraph>0</paragraph>
          </div>
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
          <paragraph>D2</paragraph>
          <div>
            <paragraph>
              D<cursor />3
            </paragraph>
          </div>
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
          <paragraph>D2</paragraph>
          <div>
            <paragraph>
              D0<cursor />3
            </paragraph>
          </div>
        </div>
      </div>
    </document>
  </value>
)
