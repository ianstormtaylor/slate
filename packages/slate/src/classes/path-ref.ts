import { Operation, Path, Editor } from '..'
import { PATH_REFS } from '../utils/state'

/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date path value.
 */

export class PathRef {
  current: Path | null
  private affinity: 'forward' | 'backward' | null
  private editor: Editor

  constructor(props: {
    path: Path | null
    affinity: 'forward' | 'backward' | null
    editor: Editor
  }) {
    const { path, affinity, editor } = props
    this.current = path
    this.affinity = affinity
    this.editor = editor
    const pathRefs = PATH_REFS.get(editor)!
    pathRefs.add(this)
  }

  /**
   * Transform the path ref's current value by an operation.
   */

  transform(op: Operation): void {
    const { current, affinity } = this

    if (current == null) {
      return
    }

    const path = Path.transform(current, op, { affinity })
    this.current = path

    if (path == null) {
      this.unref()
    }
  }

  /**
   * Unreference the ref, allowing the editor to stop updating its value.
   */

  unref(): Path | null {
    const { current, editor } = this
    const pathRefs = PATH_REFS.get(editor)!
    pathRefs.delete(this)
    this.current = null
    return current
  }
}
