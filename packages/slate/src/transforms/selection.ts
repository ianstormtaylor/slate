import { Editor, Location, Point, Range } from '..'
import { MoveUnit, SelectionEdge } from '../interfaces/types'

export interface SelectionCollapseOptions {
  edge?: SelectionEdge
}

export interface SelectionMoveOptions {
  distance?: number
  unit?: MoveUnit
  reverse?: boolean
  edge?: SelectionEdge
}

export interface SelectionSetPointOptions {
  edge?: SelectionEdge
}

export interface SelectionTransforms {
  collapse: (editor: Editor, options?: SelectionCollapseOptions) => void
  deselect: (editor: Editor) => void
  move: (editor: Editor, options?: SelectionMoveOptions) => void
  select: (editor: Editor, target: Location) => void
  setPoint: (
    editor: Editor,
    props: Partial<Point>,
    options?: SelectionSetPointOptions
  ) => void
  setSelection: (editor: Editor, props: Partial<Range>) => void
}

// eslint-disable-next-line no-redeclare
export const SelectionTransforms: SelectionTransforms = {
  /**
   * Collapse the selection.
   */
  collapse(editor, options) {
    editor.collapse(options)
  },

  /**
   * Unset the selection.
   */
  deselect(editor) {
    editor.deselect()
  },

  /**
   * Move the selection's point forward or backward.
   */
  move(editor, options) {
    editor.move(options)
  },

  /**
   * Set the selection to a new value.
   */
  select(editor, target) {
    editor.select(target)
  },

  /**
   * Set new properties on one of the selection's points.
   */
  setPoint(editor, props, options) {
    editor.setPoint(props, options)
  },

  /**
   * Set new properties on the selection.
   */
  setSelection(editor, props) {
    editor.setSelection(props)
  },
}
