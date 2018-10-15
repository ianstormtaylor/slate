/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <list>
        <item>3</item>
        <item>4</item>
      </list>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <list>
        <item>1</item>
        <item>
          2<cursor />
        </item>
      </list>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <list>
        <item>1</item>
        <item>23</item>
        <item>
          4<cursor />
        </item>
      </list>
    </document>
  </value>
)
