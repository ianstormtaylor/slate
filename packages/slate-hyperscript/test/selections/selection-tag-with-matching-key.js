/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        <text>
          This is{' '}
          <text key="100">
            a paragraph with a cursor position (closed selection).
          </text>
        </text>
      </block>
    </document>
    <selection
      anchorKey="100"
      anchorOffset={30}
      focusKey="100"
      focusOffset={30}
    />
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
  anchorOffset: 30,
  focusOffset: 30,
  anchorKey: input.texts.get(0).key,
  focusKey: input.texts.get(0).key,
}
