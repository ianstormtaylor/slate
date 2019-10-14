import { Operation, Path } from '..'

/**
 * An auto-incrementing number to identify `PathRef` objects.
 */

let id = 0

/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date path value.
 */

class PathRef {
  id: number
  current: Path | null
  private stick: 'forward' | 'backward' | null
  private onUnref: () => void

  constructor(props: {
    path: Path | null
    stick: 'forward' | 'backward' | null
    onUnref: () => void
  }) {
    const { path, stick, onUnref } = props
    this.id = id++
    this.current = path
    this.stick = stick
    this.onUnref = onUnref
  }

  /**
   * Transform the path ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, stick } = this

    if (current == null) {
      return
    }

    const path = Path.transform(current, op, { stick })
    this.current = path

    if (path == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Path | null {
    this.onUnref()
    return this.current
  }
}

export { PathRef }
