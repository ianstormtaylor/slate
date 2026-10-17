import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Descendant, Editor, Node, Operation, Scrubber, Selection } from 'slate'
import { copyNodeInUse, EDITOR_TO_ON_CHANGE } from 'slate-dom'
import { FocusedContext } from '../hooks/use-focused'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  useSelectorContext,
  SlateSelectorContext,
} from '../hooks/use-slate-selector'
import { EditorContext } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { REACT_MAJOR_VERSION } from '../utils/environment'
import { Editable } from './editable'

/** @inline */
interface SlateProps {
  /** An instance of `ReactEditor`. */
  editor: ReactEditor
  /**
   * The initial value of the editor. It is loaded into the editor when `Slate` mounts, and again if a different `editor` is passed.
   *
   * If you leave it out, the editor's existing `editor.children` are used, which suits editors you create and fill ahead of rendering. Leaving it out when `editor.children` is empty throws, since that is usually a forgotten setup step; pass `initialValue={[]}` if an empty editor is intended.
   *
   * An editor needs at least one block to hold the cursor, so an empty array is loaded as one empty block, `{ children: [{ text: '' }] }`. The block has no `type`, so if your schema requires one, pass your own empty block instead, for example `[{ type: 'paragraph', children: [{ text: '' }] }]`.
   *
   * Slate is not a controlled component: changing `initialValue` afterwards has no effect, because directly replacing the value would corrupt state such as the edit history. To change the content, apply transforms to the editor, or remount `Slate` with a new `key`.
   *
   * Each editor must have its own node objects. To render several editors from the same value, give each one a deep copy, for example with `structuredClone(value)`. Sharing the same objects between editors breaks the lookups Slate uses to map nodes to the DOM.
   */
  initialValue?: Descendant[]
  /** The `children` which must contain an `Editable` component. */
  children: React.ReactNode
  /** An optional callback function which you can use to be notified of changes in the editor's selection and/or value. */
  onChange?: (value: Descendant[]) => void
  /** An optional callback function which you can use to be notified of changes in the editor's selection. */
  onSelectionChange?: (selection: Selection) => void
  /** An optional callback function which you can use to be notified of changes in the editor's value. */
  onValueChange?: (value: Descendant[]) => void
}

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 *
 * The `Slate` component must include somewhere in its `children` the {@link Editable} component.
 * @group Components
 */
export const Slate = (props: SlateProps) => {
  const {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue,
    ...rest
  } = props

  const initializedEditor = useRef<ReactEditor | null>(null)

  if (initializedEditor.current !== editor) {
    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Slate] editor is invalid! You passed: ${Scrubber.stringify(editor)}`
      )
    }

    if (initialValue === undefined && editor.children.length === 0) {
      throw new Error(
        '[Slate] editor.children is empty and no initialValue was provided. If this is intentional, pass initialValue={[]} to the Slate component.'
      )
    }

    const value = initialValue ?? editor.children

    if (!Node.isNodeList(value)) {
      throw new Error(
        `[Slate] initialValue is invalid! Expected a list of elements but got: ${Scrubber.stringify(
          value
        )}`
      )
    }

    const copied = initialValue === undefined ? value : value.map(copyNodeInUse)
    const children = copied.every((node, i) => node === value[i])
      ? value
      : copied

    editor.children =
      children.length > 0
        ? children
        : [{ children: [{ text: '' }] } as Descendant]
    Object.assign(editor, rest)
    initializedEditor.current = editor
  }

  const { selectorContext, onChange: handleSelectorChange } =
    useSelectorContext()

  const onContextChange = useCallback(() => {
    if (onChange) {
      onChange(editor.children)
    }
    if (
      onSelectionChange &&
      editor.operations.find(op => op.type === 'set_selection')
    ) {
      onSelectionChange(editor.selection)
    }
    if (
      onValueChange &&
      editor.operations.find(op => op.type !== 'set_selection')
    ) {
      onValueChange(editor.children)
    }

    handleSelectorChange()
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange])

  useEffect(() => {
    EDITOR_TO_ON_CHANGE.set(editor, onContextChange)

    return () => {
      EDITOR_TO_ON_CHANGE.set(editor, () => {})
    }
  }, [editor, onContextChange])

  const [isFocused, setIsFocused] = useState(ReactEditor.isFocused(editor))

  useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor))
  }, [editor])

  useIsomorphicLayoutEffect(() => {
    const fn = () => setIsFocused(ReactEditor.isFocused(editor))
    if (REACT_MAJOR_VERSION >= 17) {
      // In React >= 17 onFocus and onBlur listen to the focusin and focusout events during the bubbling phase.
      // Therefore in order for <Editable />'s handlers to run first, which is necessary for ReactEditor.isFocused(editor)
      // to return the correct value, we have to listen to the focusin and focusout events without useCapture here.
      document.addEventListener('focusin', fn)
      document.addEventListener('focusout', fn)
      return () => {
        document.removeEventListener('focusin', fn)
        document.removeEventListener('focusout', fn)
      }
    } else {
      document.addEventListener('focus', fn, true)
      document.addEventListener('blur', fn, true)
      return () => {
        document.removeEventListener('focus', fn, true)
        document.removeEventListener('blur', fn, true)
      }
    }
  }, [editor])

  return (
    <SlateSelectorContext.Provider value={selectorContext}>
      <EditorContext.Provider value={editor}>
        <FocusedContext.Provider value={isFocused}>
          {children}
        </FocusedContext.Provider>
      </EditorContext.Provider>
    </SlateSelectorContext.Provider>
  )
}
