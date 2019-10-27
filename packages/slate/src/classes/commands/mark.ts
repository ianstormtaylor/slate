import { Editor, Mark, Path, Range } from '../..'

class MarkCommands {
  addMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { at = this.value.selection } = options

      if (!at) {
        return
      } else if (Range.isRange(at)) {
        at = splitRange(this, at)

        if (options.at == null) {
          this.select(at)
        }
      } else if (Path.isPath(at)) {
        at = this.getRange(at)
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
      at?: Path | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { at = this.value.selection } = options

      if (!at) {
        return
      } else if (Range.isRange(at)) {
        at = splitRange(this, at)

        if (options.at == null) {
          this.select(at)
        }
      } else if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      for (const [mark, i, node, path] of this.marks({ at })) {
        if (Mark.exists(mark, marks)) {
          this.apply({ type: 'remove_mark', path, mark })
        }
      }
    })
  }

  setMarks(
    this: Editor,
    marks: Mark[],
    props: Partial<Mark>,
    options: {
      at?: Path | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { at = this.value.selection } = options

      if (!at) {
        return
      } else if (Range.isRange(at)) {
        at = splitRange(this, at)

        if (options.at == null) {
          this.select(at)
        }
      } else if (Path.isPath(at)) {
        at = this.getRange(at)
      }

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
    })
  }

  toggleMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
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

const splitRange = (editor: Editor, range: Range): Range => {
  const rangeRef = editor.createRangeRef(range, { stick: 'inward' })
  const [start, end] = Range.points(range)
  editor.splitNodes({ at: end, match: 'text', always: false })
  editor.splitNodes({ at: start, match: 'text', always: false })
  return rangeRef.unref()!
}

export default MarkCommands
