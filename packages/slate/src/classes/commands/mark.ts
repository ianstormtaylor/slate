import { Editor, Mark, Location, Range } from '../..'

class MarkCommands {
  /**
   * Add a set of marks to the text nodes at a location.
   */

  addMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Location
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const at = splitLocation(this, options)

      if (!at) {
        return
      }

      // De-dupe the marks being added to ensure the set is unique.
      const set: Mark[] = []

      for (const mark of marks) {
        if (!Mark.exists(mark, set)) {
          set.push(mark)
        }
      }

      for (const [node, path] of this.texts({ at })) {
        for (const mark of set) {
          if (!Mark.exists(mark, node.marks)) {
            this.apply({ type: 'add_mark', path, mark })
          }
        }
      }
    })
  }

  removeMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Location
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const at = splitLocation(this, options)

      if (at) {
        for (const [mark, i, node, path] of this.marks({ at })) {
          if (Mark.exists(mark, marks)) {
            this.apply({ type: 'remove_mark', path, mark })
          }
        }
      }
    })
  }

  setMarks(
    this: Editor,
    marks: Mark[],
    props: Partial<Mark>,
    options: {
      at?: Location
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const at = splitLocation(this, options)

      if (at) {
        for (const [mark, i, node, path] of this.marks({ at })) {
          if (Mark.exists(mark, marks)) {
            const newProps = {}

            for (const k in props) {
              if (props[k] !== mark[k]) {
                newProps[k] = props[k]
              }
            }

            if (Object.keys(newProps).length > 0) {
              this.apply({
                type: 'set_mark',
                path,
                properties: mark,
                newProperties: newProps,
              })
            }
          }
        }
      }
    })
  }

  toggleMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Location
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const existing = this.getActiveMarks(options)
      const exists = marks.every(m => Mark.exists(m, existing))

      if (exists) {
        this.removeMarks(marks, options)
      } else {
        this.addMarks(marks, options)
      }
    })
  }
}

/**
 * Split the text nodes at a range's edges to prepare for adding/removing marks.
 */

const splitLocation = (
  editor: Editor,
  options: { at?: Location } = {}
): Location | undefined => {
  const { at = editor.value.selection } = options

  if (!at) {
    return
  }

  if (Range.isRange(at)) {
    const rangeRef = editor.createRangeRef(at, { affinity: 'inward' })
    const [start, end] = Range.edges(at)
    editor.splitNodes({ at: end, match: 'text' })
    editor.splitNodes({ at: start, match: 'text' })
    const range = rangeRef.unref()!

    if (options.at == null) {
      editor.select(range)
    }

    return range
  }

  return at
}

export default MarkCommands
