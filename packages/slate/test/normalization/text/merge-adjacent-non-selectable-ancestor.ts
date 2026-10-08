import { createEditor } from 'slate'

export const input = createEditor() as any

const { isSelectable, shouldNormalize } = input

input.isSelectable = (element: any) => {
  return element.type === 'collapsible-content' ? false : isSelectable(element)
}

input.shouldNormalize = (options: any) => {
  if (options.iteration > 20) {
    throw new Error(
      'Normalization likely stalled while merging text under a non-selectable element.'
    )
  }

  return shouldNormalize(options)
}

input.children = [
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

input.selection = null

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
