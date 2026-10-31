import { Operation, Range, RangeDirection } from '..'

/**
 * `RangeRef` objects keep a specific range in a document synced over time as new
 * operations are applied to the editor. It is created using the
 * {@link BaseEditor#rangeRef} method. You can access their property `current` at any time
 * for the up-to-date `Range` value. When you no longer need to track this
 * location, call `unref()` to free the resources.
 */
export interface RangeRef {
  /**
   * The up-to-date `Point` value, or null if the point has been deleted or
   * {@link unref} has been called.
   */
  current: Range | null

  /**
   * the direction the `RangeRef` will go when a user inserts content at the
   * edges of the `Range`. `inward` means that the `Range` tends to stay the
   * same size when content is inserted at its edges, and `outward` means that
   * the `Range` tends to grow when content is inserted at its edges.
   */
  affinity: RangeDirection | null
  /**
   * Free the resources used by the RangeRef. This should be called when you no
   * longer need to track the range. Returns the final range value before being
   * unrefed, or `null` if the range was already invalid.
   *
   * This removes the ref from `Editor.pointRefs(editor)` and sets `current` to `null`. If an operation removes the node containing the point, the editor releases the ref automatically. Calling `unref()` again returns `null`.
   */
  unref(): Range | null
  /**
   * Release the ref by calling `unref()`. This supports `using` declarations in runtimes or build tools with explicit resource management support. Repeated disposal is safe, including after an operation removes the tracked location.
   *
   * TypeScript consumers need TypeScript 5.2 or later with `esnext.disposable` in their `lib` configuration. If the runtime lacks `Symbol.dispose`, install a polyfill before creating refs to use `using`; the fallback key is `Symbol.for('Symbol.dispose')`. Calling `unref()` continues to work without a polyfill.
   */
  [Symbol.dispose](): void
}

export interface RangeRefInterface {
  /**
   * Transform the range ref's current value by an operation. This is called automatically by the editor as operations are applied.
   */
  transform(ref: RangeRef, op: Operation): void
}

// eslint-disable-next-line no-redeclare
export const RangeRef: RangeRefInterface = {
  transform(ref: RangeRef, op: Operation): void {
    const { current, affinity } = ref

    if (current == null) {
      return
    }

    const path = Range.transform(current, op, { affinity })
    ref.current = path

    if (path == null) {
      ref.unref()
    }
  },
}
