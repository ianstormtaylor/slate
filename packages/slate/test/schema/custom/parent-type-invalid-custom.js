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
