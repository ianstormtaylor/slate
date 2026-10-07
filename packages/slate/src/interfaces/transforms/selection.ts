import { Editor, Location, Point, Range } from '../../index'
import { MoveUnit, SelectionEdge } from '../../types/types'

/** @inline @internal */
export interface SelectionCollapseOptions {
  edge?: SelectionEdge
}

/** @inline @internal */
export interface SelectionMoveOptions {
  distance?: number
  unit?: MoveUnit
  reverse?: boolean
  edge?: SelectionEdge
}

/** @inline @internal */
export interface SelectionSetPointOptions {
  edge?: SelectionEdge
}

export interface SelectionTransforms {
  /**
   * Collapse the selection.
   */
  collapse(editor: Editor, options?: SelectionCollapseOptions): void

  /**
   * Unset the selection.
   */
  deselect(editor: Editor): void

  /**
   * Move the selection's point forward or backward.
   */
  move(editor: Editor, options?: SelectionMoveOptions): void

  /**
   * Set the selection to a new value.
   *
   * @example
   * For example, to set the selection to the entire contents of the editor:
   * ```javascript
   * Transforms.select(editor, {
   *   anchor: Editor.start(editor, []),
   *   focus: Editor.end(editor, []),
   * })
   * ```
   */
  select(editor: Editor, target: Location): void

  /**
   * Set new properties on one of the selection's points.
   */
  setPoint(
    editor: Editor,
    props: Partial<Point>,
    options?: SelectionSetPointOptions
  ): void

  /**
   * Set new properties on the selection.
   */
  setSelection(editor: Editor, props: Partial<Range>): void
}

// eslint-disable-next-line no-redeclare
export const SelectionTransforms: SelectionTransforms = {
  collapse(editor, options) {
    editor.collapse(options)
  },
  deselect(editor) {
    editor.deselect()
  },
  move(editor, options) {
    editor.move(options)
  },
  select(editor, target) {
    editor.select(target)
  },
  setPoint(editor, props, options) {
    editor.setPoint(props, options)
  },
  setSelection(editor, props) {
    editor.setSelection(props)
  },
}
