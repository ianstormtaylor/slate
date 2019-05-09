/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  annotations: {
    highlight: 'highlight',
  },
})

export const input = (
  <value>
    <document>
      <block type="paragraph">
        o<highlight key="a" />ne
      </block>
      <block type="paragraph">
        tw<highlight key="a" />o
      </block>
    </document>
  </value>
)

export const options = {
  preserveAnnotations: true,
  preserveKeys: true,
}

export const output = {
  object: 'value',
  document: {
    object: 'document',
    key: '4',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '1',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '0',
            text: 'one',
            marks: [],
          },
        ],
      },
      {
        object: 'block',
        key: '3',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '2',
            text: 'two',
            marks: [],
          },
        ],
      },
    ],
  },
  annotations: {
    a: {
      object: 'annotation',
      key: 'a',
      type: 'highlight',
      data: {},
      anchor: {
        object: 'point',
        key: '0',
        path: [0, 0],
        offset: 1,
      },
      focus: {
        object: 'point',
        key: '2',
        path: [1, 0],
        offset: 2,
      },
    },
  },
}
