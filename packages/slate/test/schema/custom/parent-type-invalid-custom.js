/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { types: ['list'] },
      normalize: (change, reason, { node }) => {
        if (reason == 'parent_type_invalid') {
          change.wrapBlockByKey(node.key, 'list')
        }
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        <item />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <list>
          <item />
        </list>
      </paragraph>
    </document>
  </state>
)
