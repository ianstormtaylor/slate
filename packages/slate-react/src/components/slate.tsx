import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Editor, Node, Element, Descendant } from 'slate'
import invariant from 'tiny-invariant'

import { ReactEditor } from '../plugin/react-editor'
import { FocusedContext } from '../hooks/use-focused'
import { EditorContext } from '../hooks/use-slate-static'
import { SlateContext } from '../hooks/use-slate'
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

export const Slate = (props: {
  editor: ReactEditor
  value: Descendant[]
  children: React.ReactNode
  onChange: (value: Descendant[]) => void
}) => {
  const { editor, children, onChange, value, ...rest } = props
  const [key, setKey] = useState(0)
  const context: [ReactEditor] = useMemo(() => {
    invariant(
      Node.isNodeList(value),
      `[Slate] value is invalid! Expected a list of elements but got: ${JSON.stringify(
        value
      )}`
    )
    invariant(
      Editor.isEditor(editor),
      `[Slate] editor is invalid! you passed: ${JSON.stringify(editor)}`
    )

    editor.children = value
    Object.assign(editor, rest)
    return [editor]
  }, [key, value, ...Object.values(rest)])

  const onContextChange = useCallback(() => {
    onChange(editor.children)
    setKey(key + 1)
  }, [key, onChange])

  EDITOR_TO_ON_CHANGE.set(editor, onContextChange)

  useEffect(() => {
    return () => {
      EDITOR_TO_ON_CHANGE.set(editor, () => {})
    }
  }, [])

  const [isFocused, setIsFocused] = useState(ReactEditor.isFocused(editor))

  useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor))
  })

  useIsomorphicLayoutEffect(() => {
    const fn = () => setIsFocused(ReactEditor.isFocused(editor))
    document.addEventListener('focus', fn, true)
    return () => document.removeEventListener('focus', fn, true)
  }, [])

  useIsomorphicLayoutEffect(() => {
    const fn = () => setIsFocused(ReactEditor.isFocused(editor))
    document.addEventListener('blur', fn, true)
    return () => document.removeEventListener('blur', fn, true)
  }, [])

  return (
    <SlateContext.Provider value={context}>
      <EditorContext.Provider value={editor}>
        <FocusedContext.Provider value={isFocused}>
          {children}
        </FocusedContext.Provider>
      </EditorContext.Provider>
    </SlateContext.Provider>
  )
}
