/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { type: 'list' },
      normalize: (change, { code, node }) => {
        if (code == 'parent_type_invalid') {
          change.wrapBlockByKey(node.key, 'list')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <item>
          <text />
        </item>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <list>
          <item>
            <text />
          </item>
        </list>
      </paragraph>
    </document>
  </value>
)
