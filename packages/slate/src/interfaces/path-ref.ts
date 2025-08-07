import { Operation, Path } from '..'

/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date path value.
 */

export interface PathRef {
  current: Path | null
  affinity: 'forward' | 'backward' | null
  onChange(path: Path | null): void
  unref(): Path | null
}

export interface PathRefInterface {
  /**
   * Transform the path ref's current value by an operation.
   */
  transform: (ref: PathRef, op: Operation) => void
}

// eslint-disable-next-line no-redeclare
export const PathRef: PathRefInterface = {
  transform(ref: PathRef, op: Operation): (() => void) | void {
    const { current, affinity } = ref

    if (current == null) {
      return
    }

    const prevPath = ref.current ? [...ref.current] : ref.current
    const path = Path.transform(current, op, { affinity })

    ref.current = path

    if (path == null) {
      ref.unref()
    }

    if (path && prevPath ? !Path.equals(path, prevPath) : path !== prevPath) {
      return () => ref.onChange(path)
    }
  },
}
