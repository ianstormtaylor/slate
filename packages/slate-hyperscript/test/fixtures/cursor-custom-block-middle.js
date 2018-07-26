/** @jsx h */

import { createHyperscript } from '../..'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
})

export const input = (
  <value>
    <document>
      <paragraph>
        o<cursor />ne
      </paragraph>
    </document>
  </value>
)

export const options = {
  preserveSelection: true,
  preserveKeys: true,
}

export const output = {
  object: 'value',
  document: {
    object: 'document',
    key: '3',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '1',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            key: '0',
            leaves: [
              {
                object: 'leaf',
                text: 'one',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
  selection: {
    object: 'range',
    anchorKey: '0',
    anchorPath: [0, 0],
    anchorOffset: 1,
    focusKey: '0',
    focusPath: [0, 0],
    focusOffset: 1,
    isBackward: false,
    isFocused: true,
    isAtomic: false,
    marks: null,
  },
}
