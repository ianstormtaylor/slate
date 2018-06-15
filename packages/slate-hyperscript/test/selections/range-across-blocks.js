/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        This is one <anchor />block.
      </block>
      <block type="paragraph">
        This is block<focus /> two.
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
                text: 'This is one block.',
                marks: [],
              },
            ],
          },
        ],
      },
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
                text: 'This is block two.',
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
  anchorOffset: 12,
  focusOffset: 13,
  anchorKey: input.texts.get(0).key,
  focusKey: input.texts.get(1).key,
}
