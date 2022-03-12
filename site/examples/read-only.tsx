import React, { useState, useMemo } from 'react'
import { createEditor, Descendant, Element } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const renderElement = (props) => {
  if (props.element.__typename === 'TemplateVariable') {
    return (
      <span
        style={{
          paddingInline: '4px',
          border: '1px solid red'
        }}
      >
        {props.element.variableType}
      </span>
    )
  }
  return props.children
}

export const withTemplateVariables = (editor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    if (element.__typename === 'TemplateVariable') {
      return true
    }
    return isInline(element)
  }

  editor.isVoid = (element) => {
    if (element.__typename === 'TemplateVariable') {
      return true
    }
    return isVoid(element)
  }

  return editor
}

const ReadOnlyExample = () => {
  const editor = useMemo(
    () => withTemplateVariables(withReact(createEditor())),
    []
  )
  return (
    <Slate
      editor={editor}
      value={[
        {
          children: [
            {
              text: 'This is readonly text',
              marks: []
            },
            {
              __typename: 'TemplateVariable',
              variableType: 'name',
              children: [{ text: '' }]
            }
          ]
        }
      ]}
      onChange={() => undefined}
    >
      <Editable
        placeholder="Enter some plain text..."
        style={{
          padding: '10px',
          border: '1px solid #999'
        }}
        renderElement={renderElement}
        readOnly
      />
    </Slate>
  )
}

export default ReadOnlyExample
