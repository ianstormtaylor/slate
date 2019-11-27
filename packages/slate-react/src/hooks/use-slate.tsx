import React, { useState, useMemo } from 'react'
import { Editor, Node, Operation } from 'slate'
import { createContext, useContext } from 'react'
import { ReactEditor } from '../react-editor'
import { FocusedContext } from './use-focused'
import { EditorContext } from './use-editor'

/**
 * Associate the context change listener with the editor.
 */

export const EDITOR_TO_CONTEXT_LISTENER = new WeakMap<
  Editor,
  (children: Node[], operations: Operation[]) => void
>()

/**
 * A React context for sharing the `Editor` class, in a way that re-renders the
 * context whenever changes occur.
 */

export const SlateContext = createContext<[Editor] | null>(null)

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

export const Slate = (props: {
  editor: Editor
  children: JSX.Element
  defaultValue?: Node[]
  onChange?: (children: Node[], operations: Operation[]) => void
}) => {
  const { editor, children, defaultValue = [], onChange = () => {} } = props
  const [context, setContext] = useState([editor])
  const value: [Editor] = useMemo(() => [editor], [context, editor])
  const listener = useMemo(() => {
    editor.children = defaultValue

    return (children: Node[], operations: Operation[]) => {
      onChange(children, operations)
      setContext([editor])
    }
  }, [editor])

  EDITOR_TO_CONTEXT_LISTENER.set(editor, listener)

  return (
    <SlateContext.Provider value={value}>
      <EditorContext.Provider value={editor}>
        <FocusedContext.Provider value={ReactEditor.isFocused(editor)}>
          {children}
        </FocusedContext.Provider>
      </EditorContext.Provider>
    </SlateContext.Provider>
  )
}

/**
 * Get the current `Editor` class that the component lives under.
 */

export const useSlate = () => {
  const context = useContext(SlateContext)

  if (!context) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <SlateProvider> component's context.`
    )
  }

  const [editor] = context
  return editor
}
