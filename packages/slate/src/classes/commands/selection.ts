import { Editor, Point, Range, Selection } from '../..'

class SelectionCommands {
  /**
   * Blur the selection.
   */

  blur(this: Editor) {
    this.select({ isFocused: false })
  }

  /**
   * Deselect the selection.
   */

  deselect(this: Editor) {
    this.select(null)
  }

  /**
   * Focus the selection.
   */

  focus(this: Editor) {
    this.select({ isFocused: true })
  }

  /**
   * Flip the selection's anchor and focus points.
   */

  flip(this: Editor) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const { anchor, focus } = selection
    this.select({ anchor: focus, focus: anchor })
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
    this.select({ anchor: point })
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
    this.select({ anchor: point })
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
    this.select({ anchor: point, focus: point })
  }

  /**
   * Set new properties on the selection.
   */

  select(this: Editor, properties: Partial<Selection> | null) {
    const { selection } = this.value
    let prevProps: Partial<Selection> | null = {}
    let newProps: Partial<Selection> | null = {}

    if (selection == null && properties == null) {
      return
    } else if (properties == null) {
      newProps = null
      prevProps = selection
    } else if (selection == null) {
      newProps = { isFocused: false, ...properties }
      prevProps = null

      if (!Selection.isSelection(newProps)) {
        throw new Error(
          `When setting new selection properties and the current selection is \`null\` you must provide a full selection, but you passed: ${properties}`
        )
      }
    } else {
      let isChange = false

      // Remove any properties that aren't different from the existing selection.
      for (const k in properties) {
        const isPoint = k === 'anchor' || k === 'focus'

        if (
          (isPoint && !Point.equals(properties[k], selection[k])) ||
          (!isPoint && properties[k] !== selection[k])
        ) {
          isChange = true
          newProps[k] = properties[k]
          prevProps[k] = selection[k]
        }
      }

      // If the selection moves, clear any marks, unless the new selection
      // properties change the marks in some way.
      if (
        selection.marks &&
        !newProps.marks &&
        (newProps.anchor || newProps.focus)
      ) {
        isChange = true
        newProps.marks = null
        prevProps.marks = selection.marks
      }

      if (!isChange) {
        return
      }
    }

    this.apply({
      type: 'set_selection',
      properties: prevProps,
      newProperties: newProps,
    })
  }
}

export default SelectionCommands
