/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        This is a paragraph with a cursor position <cursor />(closed selection).
      </block>
    </document>
  </value>
)

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text:
                  'This is a paragraph with a cursor position (closed selection).',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const expectSelection = {
  isCollapsed: true,
  anchorOffset: 43,
  focusOffset: 43,
  anchorKey: input.texts.get(0).key,
  focusKey: input.texts.get(0).key,
}
