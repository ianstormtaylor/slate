import { Editor, Operation, Path } from '..'

/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. It is created using the
 * {@link Editor.pathRef} method. You can access their property `current` at any time
 * for the up-to-date `Path` value. When you no longer need to track this
 * location, call `unref()` to free the resources.
 */
export interface PathRef {
  /**
   * The up-to-date `Path` value, or null if the path has been deleted or
   * {@link unref} has been called.
   */
  current: Path | null
  /**
   * The direction the `PathRef` will go when a user inserts content at the
   * current position of the `Path`.
   */
  affinity: 'forward' | 'backward' | null
  /**
   * Free the resources used by the PathRef. This should be called when you no
   * longer need to track the path. Returns the final path value before being
   * unrefed, or `null` if the path was already invalid.
   */
  unref(): Path | null
}

export interface PathRefInterface {
  /**
   * Transform a PathRef's current value by an operation.
   */
  transform: (ref: PathRef, op: Operation) => void
}

// eslint-disable-next-line no-redeclare
export const PathRef: PathRefInterface = {
  transform(ref: PathRef, op: Operation): void {
    const { current, affinity } = ref

    if (current == null) {
      return
    }

    const path = Path.transform(current, op, { affinity })
    ref.current = path

    if (path == null) {
      ref.unref()
    }
  },
}
