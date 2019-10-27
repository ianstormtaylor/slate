import { Editor, Point, Range, Path } from '../..'

class SelectionCommands {
  /**
   * Collapse the selection.
   */

  collapse(
    this: Editor,
    options: {
      edge?: 'anchor' | 'focus' | 'start' | 'end'
    } = {}
  ) {
    const { edge = 'anchor' } = options
    const { selection } = this.value

    if (!selection) {
      return
    } else if (edge === 'anchor') {
      this.select(selection.anchor)
    } else if (edge === 'focus') {
      this.select(selection.focus)
    } else if (edge === 'start') {
      const [start] = Range.points(selection)
      this.select(start)
    } else if (edge === 'end') {
      const [, end] = Range.points(selection)
      this.select(end)
    }
  }

  /**
   * Unset the selection.
   */

  deselect(this: Editor) {
    const { selection } = this.value

    if (selection) {
      this.apply({
        type: 'set_selection',
        properties: selection,
        newProperties: null,
      })
    }
  }

  /**
   * Move the selection's point forward or backward.
   */

  move(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
      edge?: 'anchor' | 'focus' | 'start' | 'end'
    } = {}
  ) {
    const { selection } = this.value
    const { distance = 1, unit = 'character', reverse = false } = options
    let { edge = null } = options

    if (!selection) {
      return
    }

    if (edge === 'start') {
      edge = Range.isBackward(selection) ? 'focus' : 'anchor'
    }

    if (edge === 'end') {
      edge = Range.isBackward(selection) ? 'anchor' : 'focus'
    }

    const { anchor, focus } = selection
    const opts = { distance, unit }
    const props: Partial<Range> = {}

    if (edge == null || edge === 'anchor') {
      const point = reverse
        ? this.getPreviousPoint(anchor, opts)
        : this.getNextPoint(anchor, opts)

      if (point) {
        props.anchor = point
      }
    }

    if (edge == null || edge === 'focus') {
      const point = reverse
        ? this.getPreviousPoint(focus, opts)
        : this.getNextPoint(focus, opts)

      if (point) {
        props.focus = point
      }
    }

    this.setSelection(props)
  }

  /**
   * Set the selection to a new value.
   */

  select(this: Editor, target: Range | Point | Path) {
    const { selection } = this.value

    if (Point.isPoint(target)) {
      target = { anchor: target, focus: target }
    } else if (Path.isPath(target)) {
      target = this.getRange(target)
    }

    if (selection) {
      this.setSelection(target)
      return
    }

    if (!Range.isRange(target)) {
      throw new Error(
        `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${JSON.stringify(
          target
        )}`
      )
    }

    this.apply({
      type: 'set_selection',
      properties: selection,
      newProperties: target,
    })
  }

  /**
   * Set new properties on one of the selection's points.
   */

  setPoint(
    this: Editor,
    props: Partial<Point>,
    options: {
      edge?: 'anchor' | 'focus' | 'start' | 'end'
    }
  ) {
    const { selection } = this.value
    let { edge = 'both' } = options

    if (!selection) {
      return
    }

    if (edge === 'start') {
      edge = Range.isBackward(selection) ? 'focus' : 'anchor'
    }

    if (edge === 'end') {
      edge = Range.isBackward(selection) ? 'anchor' : 'focus'
    }

    const { anchor, focus } = selection
    const point = edge === 'anchor' ? anchor : focus
    const newPoint = Object.assign(point, props)

    if (edge === 'anchor') {
      this.setSelection({ anchor: newPoint })
    } else {
      this.setSelection({ focus: newPoint })
    }
  }

  /**
   * Set new properties on the selection.
   */

  setSelection(this: Editor, props: Partial<Range>) {
    const { selection } = this.value
    const oldProps: Partial<Range> | null = {}
    const newProps: Partial<Range> = {}

    if (!selection) {
      return
    }

    for (const k in props) {
      if (
        (k === 'anchor' &&
          props.anchor != null &&
          !Point.equals(props.anchor, selection.anchor)) ||
        (k === 'focus' &&
          props.focus != null &&
          !Point.equals(props.focus, selection.focus)) ||
        props[k] !== selection[k]
      ) {
        oldProps[k] = selection[k]
        newProps[k] = props[k]
      }
    }

    if (Object.keys(oldProps).length > 0) {
      this.apply({
        type: 'set_selection',
        properties: oldProps,
        newProperties: newProps,
      })
    }
  }
}

export default SelectionCommands
