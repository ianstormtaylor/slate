/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { type: 'list' },
      normalize: (editor, { code, path }) => {
        if (code === 'parent_type_invalid') {
          editor.wrapBlockByPath(path, 'list')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <block>
          <text />
        </block>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <block>
          <block>
            <text />
          </block>
        </block>
      </block>
    </document>
  </value>
)
