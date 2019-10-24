import { Editor, Mark, Path, Range } from '../..'

class MarkingCommands {
  addMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at } = options
      let isSelection = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (!Range.isRange(at)) {
        return
      }

      // Split the text nodes at the range's edges if necessary.
      const rangeRef = this.createRangeRef(at, { stick: 'inward' })
      const [start, end] = Range.points(at)
      this.splitNodes({ at: end, always: false })
      this.splitNodes({ at: start, always: false })
      at = rangeRef.unref()!

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

      if (isSelection) {
        this.select(at)
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
      const { selection } = this.value
      let { at } = options
      let isSelection = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (Range.isRange(at)) {
        const rangeRef = this.createRangeRef(at, { stick: 'inward' })
        const [start, end] = Range.points(at)
        this.splitNodes({ at: end, always: false })
        this.splitNodes({ at: start, always: false })
        at = rangeRef.unref()!

        for (const [mark, i, node, path] of this.marks({ at })) {
          if (Mark.exists(mark, marks)) {
            this.apply({ type: 'remove_mark', path, mark })
          }
        }

        if (isSelection) {
          this.select(at)
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
      const { selection } = this.value
      let { at } = options
      let isSelection = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      // PERF: Do this before the path coercion logic since we're guaranteed not
      // to need to split in that case.
      if (Range.isRange(at)) {
        // Split the text nodes at the range's edges if necessary.
        const rangeRef = this.createRangeRef(at, { stick: 'inward' })
        const [start, end] = Range.points(at)
        this.splitNodes({ at: end, always: false })
        this.splitNodes({ at: start, always: false })
        at = rangeRef.unref()!
      }

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (Range.isRange(at)) {
        for (const [mark, i, node, path] of this.marks({ at })) {
          if (!Mark.exists(mark, marks)) {
            continue
          }

          const newProps = {}

          for (const k in props) {
            if (props[k] !== mark[k]) {
              newProps[k] = props[k]
            }
          }

          // If no properties have changed don't apply an operation at all.
          if (Object.keys(newProps).length === 0) {
            continue
          }

          this.apply({
            type: 'set_mark',
            path,
            properties: mark,
            newProperties: newProps,
          })
        }

        if (isSelection) {
          this.select(at)
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
      const { at } = options
      const existing = this.getActiveMarks({ at })
      const exists = marks.every(m => Mark.exists(m, existing))

      if (exists) {
        this.removeMarks(marks, { at })
      } else {
        this.addMarks(marks, { at })
      }
    })
  }
}

export default MarkingCommands
