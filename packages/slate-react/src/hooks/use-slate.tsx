import { MutableRefObject, useContext, useMemo, useReducer } from 'react'
import { Editor } from 'slate'
import { SlateSelectorContext } from './use-slate-selector'
import { useSlateStatic } from './use-slate-static'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

/**
 * Get the current editor object and re-render whenever it changes.
 */

export const useSlate = (): Editor => {
  const { addEventListener } = useContext(SlateSelectorContext)
  const [, forceRender] = useReducer(s => s + 1, 0)

  if (!addEventListener) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <Slate> component's context.`
    )
  }

  useIsomorphicLayoutEffect(
    () => addEventListener(forceRender),
    [addEventListener]
  )

  return useSlateStatic()
}

const EDITOR_TO_V = new WeakMap<Editor, MutableRefObject<number>>()

const getEditorVersionRef = (editor: Editor): MutableRefObject<number> => {
  let v = EDITOR_TO_V.get(editor)

  if (v) {
    return v
  }

  v = { current: 0 }
  EDITOR_TO_V.set(editor, v)

  // Register the `onChange` handler exactly once per editor
  const { onChange } = editor

  editor.onChange = options => {
    v!.current++
    onChange(options)
  }

  return v
}

/**
 * Get the current editor object and its version, which increments on every
 * change.
 *
 * @deprecated The `v` counter is no longer used except for this hook, and may
 * be removed in a future version.
 */

export const useSlateWithV = (): { editor: Editor; v: number } => {
  const editor = useSlate()
  const vRef = useMemo(() => getEditorVersionRef(editor), [editor])
  return { editor, v: vRef.current }
}
