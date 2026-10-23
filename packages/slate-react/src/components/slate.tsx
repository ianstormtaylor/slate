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
   * Changing `initialValue` afterwards has no effect. Use `value` for controlled content, apply transforms, or remount `Slate` with a new `key`.
   *
   * Slate is not a controlled component: changing `initialValue` afterwards has no effect, because directly replacing the value would corrupt state such as the edit history. To change the content, apply transforms to the editor, or remount `Slate` with a new `key`.
   *
   * Each editor must have its own node objects. To render several editors from the same value, give each one a deep copy, for example with `structuredClone(value)`. Sharing the same objects between editors breaks the lookups Slate uses to map nodes to the DOM.
   */
  initialValue?: Descendant[] | undefined

  /**
   * Control the document with a value from your app, and store the user's edits with `onValueChange`. Passing both `value` and `initialValue` throws. The first value loads the editor as `initialValue` does. Later values are applied in a layout effect through `editor.setChildren` (`Transforms.setChildren`), so the selection and history stay valid.
   *
   * It follows the contract of a React controlled input:
   *
   * - Pass back the value from `onValueChange`. That exact object is recognized and not applied again.
   * - Any other value is treated as a change from outside the editor and applied, including an older value the editor emitted earlier, so an app can restore a previous version.
   * - Values you pass in, and their normalization, are not reported through `onValueChange`. `onChange` still fires.
   *
   * Don't feed responses from a server into `value` while the user can still type. A response to an earlier save describes an older document, and applying it reverts the typing made since. Apply outside changes with `Transforms.setChildren` at the point your app decides they are new content.
   *
   * Keep unchanged node objects when building a new value. Identity makes unchanged subtrees cheap to recognize and lets moved nodes keep the selection inside them. Deep-equal copies produce no operations but need a content comparison.
   *
   * To change how values are applied, override `editor.setChildren`. For example, to keep a stream out of undo:
   *
   * ```typescript
   * const { setChildren } = editor
   * editor.setChildren = children =>
   *   HistoryEditor.withoutSaving(editor, () => setChildren(children))
   * ```
   *
   * Updates wait while the editor is composing or Android has pending input, and only the latest pending value is applied afterwards. Pending updates are dropped when `Slate` unmounts or its editor changes.
   *
   * To switch to a different document, remount `Slate` with a new `key` instead of passing the new document as `value`. Applying a whole new document records it as an undo step and diffs it against the old one.
   */
  value?: Descendant[] | undefined

  /** The `children` which must contain an `Editable` component. */
  children: React.ReactNode

  /** An optional callback function which you can use to be notified of changes in the editor's selection and/or value. */
  onChange?: ((value: Descendant[]) => void) | undefined

  /** An optional callback function which you can use to be notified of changes in the editor's selection. */
  onSelectionChange?: ((selection: Selection) => void) | undefined

  /** An optional callback function which you can use to be notified of changes in the editor's value. */
  onValueChange?: ((value: Descendant[]) => void) | undefined
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
