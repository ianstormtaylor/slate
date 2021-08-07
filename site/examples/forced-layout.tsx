import React, { useState, useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import {
  Transforms,
  createEditor,
  Node,
  Element as SlateElement,
  Descendant,
} from 'slate'
import { withHistory } from 'slate-history'
import { ParagraphElement, TitleElement } from './custom-types'

const withLayout = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title: TitleElement = {
          type: 'title',
          children: [{ text: 'Untitled' }],
        }
        Transforms.insertNodes(editor, title, { at: path.concat(0) })
      }

      if (editor.children.length < 2) {
        const paragraph: ParagraphElement = {
          type: 'paragraph',
          children: [{ text: '' }],
        }
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'title' : 'paragraph'

        if (SlateElement.isElement(child) && child.type !== type) {
          const newProperties: Partial<SlateElement> = { type }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        }
      }
    }

    return normalizeNode([node, path])
  }

  return editor
}

const ForcedLayoutExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(
    () => withLayout(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderElement={renderElement}
        placeholder="Enter a title…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'title':
      return <h2 {...attributes}>{children}</h2>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
  }
}

const initialValue: Descendant[] = [
  {
    type: 'title',
    children: [{ text: 'Enforce Your Layout!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how to enforce your layout with domain-specific constraints. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
      },
    ],
  },
]

export default ForcedLayoutExample
