/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        This is a <anchor />paragraph<focus /> with an open selection.
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
                text: 'This is a paragraph with an open selection.',
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
  isCollapsed: false,
  anchorOffset: 10,
  focusOffset: 19,
  anchorKey: input.texts.get(0).key,
  focusKey: input.texts.get(0).key,
}
