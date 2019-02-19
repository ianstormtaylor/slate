/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <div>
        <paragraph>a</paragraph>
        <div0>
          <div>
            <paragraph>b</paragraph>
          </div>
          <div>
            <paragraph>c</paragraph>
          </div>
        </div0>
      </div>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <div>
        <paragraph>
          0<cursor />
        </paragraph>
      </div>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <div>
        <paragraph>0a</paragraph>
        <div0>
          <div>
            <paragraph>b</paragraph>
          </div>
          <div>
            <paragraph>
              c<cursor />
            </paragraph>
          </div>
        </div0>
      </div>
    </document>
  </value>
)
