import { Editor, Operation } from 'slate'

export const AS_NATIVE: WeakMap<Editor, boolean> = new WeakMap()
export const NATIVE_OPERATIONS: WeakMap<Editor, Operation[]> = new WeakMap()

/**
 * `asNative` queues operations as native, meaning native browser events will
 * not have been prevented, and we need to flush the operations
 * after the native events have propogated to the DOM.
 * @param {Editor} editor - Editor on which the operations are being applied
 * @param {callback} fn - Function containing .exec calls which will be queued as native
 */
export const asNative = (editor: Editor, fn: () => void) => {
  AS_NATIVE.set(editor, true)
  fn()
  AS_NATIVE.set(editor, false)
}

/**
 * `flushNativeEvents` applies any queued native events.
 * @param {Editor} editor - Editor on which the operations are being applied
 */
export const flushNativeEvents = (editor: Editor) => {
  const nativeOps = NATIVE_OPERATIONS.get(editor)

  // Clear list _before_ applying, as we might flush
  // events in each op, as well.
  NATIVE_OPERATIONS.set(editor, [])

  if (nativeOps) {
    Editor.withoutNormalizing(editor, () => {
      nativeOps.forEach(op => {
        editor.apply(op)
      })
    })
  }
}
