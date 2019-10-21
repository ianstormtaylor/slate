import { Editor, Point, Range, Selection } from '../..'

class SelectionCommands {
  /**
   * Blur the selection.
   */

  blur(this: Editor) {
    const { selection } = this.value

    if (selection != null) {
      this.select({ isFocused: false })
    }
  }

  /**
   * Deselect the selection.
   */

  deselect(this: Editor) {
    const { selection } = this.value

    if (selection != null) {
      this.apply({
        type: 'set_selection',
        properties: selection,
        newProperties: null,
      })
    }
  }

  /**
   * Focus the selection.
   */

  focus(this: Editor) {
    const { selection } = this.value

    if (selection != null) {
      this.select({ isFocused: true })
    }
  }

  /**
   * Flip the selection's anchor and focus points.
   */

  flip(this: Editor) {
    const { selection } = this.value

    if (selection != null) {
      const { anchor, focus } = selection
      this.setSelection({ anchor: focus, focus: anchor })
    }
  }

  /**
   * Move the selection.
   *
   * @param {Number} n
   */

  move(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ) {
    this.moveAnchor(options)
    this.moveFocus(options)
  }

  /**
   * Move the selection's anchor point.
   *
   * @param {Number} n
   */

  moveAnchor(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const { anchor } = selection
    const { reverse = false, ...rest } = options
    const point = reverse
      ? this.getPreviousPoint(anchor, rest)
      : this.getNextPoint(anchor, rest)

    if (point) {
      this.moveAnchorTo(point)
    }
  }

  /**
   * Move the selection's anchor point to a new point.
   */

  moveAnchorTo(this: Editor, point: Point) {
    this.setSelection({ anchor: point })
  }

  /**
   * Move the selection's end point.
   */

  moveEnd(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      allowZeroWidth?: boolean
    } = {}
  ) {
    const { selection } = this.value

    if (selection == null) {
      return
    } else if (Range.isForward(selection)) {
      this.moveFocus(options)
    } else {
      this.moveAnchor(options)
    }
  }

  /**
   * Move the selection's end point to a new point.
   */

  moveEndTo(this: Editor, point: Point) {
    const { selection } = this.value

    if (selection == null) {
      return
    } else if (Range.isForward(selection)) {
      this.moveFocusTo(point)
    } else {
      this.moveAnchorTo(point)
    }
  }

  /**
   * Move the selection's focus point.
   *
   * @param {Number} n
   */

  moveFocus(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const { focus } = selection
    const { reverse = false, ...rest } = options
    const point = reverse
      ? this.getPreviousPoint(focus, rest)
      : this.getNextPoint(focus, rest)

    if (point) {
      this.moveFocusTo(point)
    }
  }

  /**
   * Move the selection's focus point to a new point.
   */

  moveFocusTo(this: Editor, point: Point) {
    this.setSelection({ focus: point })
  }

  /**
   * Move the selection's start point.
   */

  moveStart(
    this: Editor,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ) {
    const { selection } = this.value

    if (selection == null) {
      return
    } else if (Range.isForward(selection)) {
      this.moveAnchor(options)
    } else {
      this.moveFocus(options)
    }
  }

  /**
   * Move the selection's start point to a new point.
   */

  moveStartTo(this: Editor, point: Point) {
    const { selection } = this.value

    if (selection == null) {
      return
    } else if (Range.isForward(selection)) {
      this.moveAnchorTo(point)
    } else {
      this.moveFocusTo(point)
    }
  }

  /**
   * Move the cursor to a specific point.
   */

  moveTo(this: Editor, point: Point) {
    this.setSelection({ anchor: point, focus: point })
  }

  /**
   * Set the selection to a new value.
   */

  select(this: Editor, props: Partial<Selection>) {
    const { selection } = this.value

    if (selection != null) {
      this.setSelection(props)
      return
    }

    if (!Range.isRange(props)) {
      throw new Error(
        `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${JSON.stringify(
          props
        )}`
      )
    }

    this.apply({
      type: 'set_selection',
      properties: selection,
      newProperties: { isFocused: false, marks: null, ...props },
    })
  }

  /**
   * Set new props on the selection.
   */

  setSelection(this: Editor, props: Partial<Selection>) {
    const { selection } = this.value
    let oldProps: Partial<Selection> | null = {}
    let newProps: Partial<Selection> = {}

    if (selection == null) {
      this.select(props)
      return
    }

    // Remove any props that aren't different from the existing selection.
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

    // If the selection moves, clear any marks, unless the new selection
    // props change the marks in some way.
    if (
      selection.marks != null &&
      newProps.marks === undefined &&
      (newProps.anchor || newProps.focus)
    ) {
      newProps.marks = null
      oldProps.marks = selection.marks
    }

    // If nothing has changed, don't apply any operations.
    if (Object.keys(oldProps).length === 0) {
      return
    }

    this.apply({
      type: 'set_selection',
      properties: oldProps,
      newProperties: newProps,
    })
  }
}

export default SelectionCommands
