import { Editor, Location, Point, Selection } from '../../index'
import { MoveUnit, SelectionEdge } from '../../types/types'

/** @hidden @inline */
export interface SelectionCollapseOptions {
  edge?: SelectionEdge
}

/** @hidden @inline */
export interface SelectionMoveOptions {
  distance?: number
  unit?: MoveUnit
  reverse?: boolean
  edge?: SelectionEdge
}

/** @hidden @inline */
export interface SelectionSetPointOptions {
  edge?: SelectionEdge
}

export interface SelectionTransforms {
  /**
   * {@inheritDoc BaseEditor#collapse}
   */
  collapse(editor: Editor, options?: SelectionCollapseOptions): void

  /**
   * {@inheritDoc BaseEditor#deselect}
   */
  deselect(editor: Editor): void

  /**
   * {@inheritDoc BaseEditor#move}
   */
  move(editor: Editor, options?: SelectionMoveOptions): void

  /**
   * {@inheritDoc BaseEditor#select}
   */
  select(editor: Editor, target: Location): void

  /**
   * {@inheritDoc BaseEditor#setPoint}
   */
  setPoint(
    editor: Editor,
    props: Partial<Point>,
    options?: SelectionSetPointOptions
  ): void

  /**
   * {@inheritDoc BaseEditor#setSelection}
   */
  setSelection(editor: Editor, props: Partial<Selection>): void
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
