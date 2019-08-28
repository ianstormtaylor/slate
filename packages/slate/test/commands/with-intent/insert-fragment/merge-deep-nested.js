/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <list>
        <item>
          <paragraph>2</paragraph>
        </item>
        <item>
          <paragraph>3</paragraph>
        </item>
      </list>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <list>
        <item>
          <paragraph>
            1<cursor />
          </paragraph>
        </item>
      </list>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <list>
        <item>
          <paragraph>12</paragraph>
        </item>
        <item>
          <paragraph>
            3<cursor />
          </paragraph>
        </item>
      </list>
    </document>
  </value>
)
