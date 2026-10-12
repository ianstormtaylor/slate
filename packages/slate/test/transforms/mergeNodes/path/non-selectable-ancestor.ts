import { createEditor, Transforms } from 'slate'

export const input = createEditor() as any

export const run = editor => {
  const { isSelectable } = editor

  editor.isSelectable = (element: any) => {
    return element.type === 'collapsible-content'
      ? false
      : isSelectable(element)
  }

  editor.children = [
    {
      type: 'paragraph',
      children: [{ text: 'Before the collapsible.' }],
    },
    {
      type: 'collapsible',
      children: [
        {
          type: 'collapsible-summary',
          children: [{ text: 'Summary' }],
        },
        {
          type: 'collapsible-content',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'is' }, { text: ' here' }],
            },
          ],
        },
      ],
    },
  ]

  editor.selection = null

  Transforms.mergeNodes(editor, { at: [1, 1, 0, 1], voids: true })
}

export const output = {
  children: [
    {
      type: 'paragraph',
      children: [{ text: 'Before the collapsible.' }],
    },
    {
      type: 'collapsible',
      children: [
        {
          type: 'collapsible-summary',
          children: [{ text: 'Summary' }],
        },
        {
          type: 'collapsible-content',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'is here' }],
            },
          ],
        },
      ],
    },
  ],
  selection: null,
} as any
