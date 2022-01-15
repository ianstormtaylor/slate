import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Editor, Node, Element, Descendant } from 'slate'
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

  const [context, setContext] = React.useState<[ReactEditor]>(() => {
    if (!Node.isNodeList(value)) {
      throw new Error(
        `[Slate] value is invalid! Expected a list of elements` +
          `but got: ${JSON.stringify(value)}`
      )
    }
    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Slate] editor is invalid! you passed:` + `${JSON.stringify(editor)}`
      )
    }
    editor.children = value
    Object.assign(editor, rest)
    return [editor]
  })

  const onContextChange = useCallback(() => {
    onChange(editor.children)
    setContext([editor])
  }, [onChange])

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
    const fn = () => {
      setTimeout(() => {
        setIsFocused(ReactEditor.isFocused(editor))
      }, 0)
    }
    document.addEventListener('focus', fn, true)
    document.addEventListener('blur', fn, true)
    return () => {
      document.removeEventListener('focus', fn, true)
      document.removeEventListener('blur', fn, true)
    }
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
