import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Descendant,
  Editor,
  Node,
  Operation,
  Scrubber,
  Selection,
  Transforms,
} from 'slate'
import {
  copyNodeInUse,
  EDITOR_TO_ON_CHANGE,
  EDITOR_TO_PENDING_ACTION,
  EDITOR_TO_PENDING_DIFFS,
} from 'slate-dom'
import { FocusedContext } from '../hooks/use-focused'
import { EDITOR_TO_COMPOSING } from '../hooks/use-composing'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  useSelectorContext,
  SlateSelectorContext,
} from '../hooks/use-slate-selector'
import { EditorContext } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { REACT_MAJOR_VERSION } from '../utils/environment'

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

export const Slate = (props: {
  editor: ReactEditor
  initialValue?: Descendant[] | undefined
  value?: Descendant[] | undefined
  children: React.ReactNode
  onChange?: ((value: Descendant[]) => void) | undefined
  onSelectionChange?: ((selection: Selection) => void) | undefined
  onValueChange?: ((value: Descendant[]) => void) | undefined
}) => {
  const {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue,
    value: controlledValue,
    ...rest
  } = props

  const initializedEditor = useRef<ReactEditor | null>(null)
  const lastEmittedValue = useRef<Descendant[] | undefined>(undefined)
  const lastAppliedValue = useRef<Descendant[] | undefined>(undefined)
  const appliedChildren = useRef<Descendant[] | undefined>(undefined)

  if (controlledValue !== undefined && initialValue !== undefined) {
    throw new Error('[Slate] value and initialValue cannot be used together.')
  }
  if (controlledValue !== undefined && !Node.isNodeList(controlledValue)) {
    throw new Error(
      `[Slate] value is invalid! Expected a list of elements but got: ${Scrubber.stringify(
        controlledValue
      )}`
    )
  }

  if (initializedEditor.current !== editor) {
    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Slate] editor is invalid! You passed: ${Scrubber.stringify(editor)}`
      )
    }

    if (
      initialValue === undefined &&
      controlledValue === undefined &&
      editor.children.length === 0
    ) {
      throw new Error(
        '[Slate] editor.children is empty and no initialValue was provided. If this is intentional, pass initialValue={[]} to the Slate component.'
      )
    }

    const value = initialValue ?? controlledValue ?? editor.children

    if (!Node.isNodeList(value)) {
      throw new Error(
        `[Slate] initialValue is invalid! Expected a list of elements but got: ${Scrubber.stringify(
          value
        )}`
      )
    }

    const copied =
      initialValue === undefined && controlledValue === undefined
        ? value
        : value.map(copyNodeInUse)
    const children = copied.every((node, i) => node === value[i])
      ? value
      : copied

    editor.children =
      children.length > 0
        ? children
        : [{ children: [{ text: '' }] } as Descendant]
    Object.assign(editor, rest)
    initializedEditor.current = editor
    lastEmittedValue.current = undefined
    lastAppliedValue.current = controlledValue
  }

  const { selectorContext, onChange: handleSelectorChange } =
    useSelectorContext()

  const onContextChange = useCallback(() => {
    const changed = editor.operations.some(op => op.type !== 'set_selection')
    const external = changed && editor.children === appliedChildren.current
    appliedChildren.current = undefined
    if (changed && !external) {
      lastEmittedValue.current = editor.children
    }
    if (onChange) {
      onChange(editor.children)
    }
    if (
      onSelectionChange &&
      editor.operations.find(op => op.type === 'set_selection')
    ) {
      onSelectionChange(editor.selection)
    }
    if (onValueChange && changed && !external) {
      onValueChange(editor.children)
    }

    handleSelectorChange()
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange])

  const controlled = controlledValue !== undefined
  const registerOnChange = useCallback(() => {
    const callback = () => onContextChange()
    EDITOR_TO_ON_CHANGE.set(editor, callback)
    return () => {
      if (EDITOR_TO_ON_CHANGE.get(editor) === callback) {
        EDITOR_TO_ON_CHANGE.delete(editor)
      }
    }
  }, [editor, onContextChange])

  useEffect(() => {
    if (!controlled) return registerOnChange()
  }, [controlled, registerOnChange])

  useIsomorphicLayoutEffect(() => {
    if (controlled) return registerOnChange()
  }, [controlled, registerOnChange])

  useIsomorphicLayoutEffect(() => {
    let frame: number | undefined
    const apply = () => {
      if (controlledValue === undefined) return
      if (controlledValue === lastEmittedValue.current) {
        lastAppliedValue.current = controlledValue
        return
      }
      if (controlledValue === lastAppliedValue.current) return
      if (
        ReactEditor.isComposing(editor) ||
        EDITOR_TO_COMPOSING.get(editor) ||
        EDITOR_TO_PENDING_ACTION.get(editor) ||
        EDITOR_TO_PENDING_DIFFS.get(editor)?.length
      ) {
        frame = window.requestAnimationFrame(apply)
        return
      }
      const previous = editor.children
      lastAppliedValue.current = controlledValue
      Transforms.setChildren(editor, controlledValue)
      if (previous !== editor.children) {
        appliedChildren.current = editor.children
        handleSelectorChange()
      }
    }
    apply()
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [editor, controlledValue, handleSelectorChange])

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
