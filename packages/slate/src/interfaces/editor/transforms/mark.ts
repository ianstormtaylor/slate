import { Editor, Mark, Location, Range } from '../../..'

export const MarkTransforms = {
  /**
   * Add a set of marks to the text nodes at a location.
   */

  addMarks(
    editor: Editor,
    mark: Mark | Mark[],
    options: {
      at?: Location
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const at = splitLocation(editor, options)

      if (!at) {
        return
      }

      // De-dupe the marks being added to ensure the set is unique.
      const marks = Array.isArray(mark) ? mark : [mark]
      const set: Mark[] = []

      for (const m of marks) {
        if (!Mark.exists(m, set)) {
          set.push(m)
        }
      }

      for (const [node, path] of Editor.texts(editor, { at })) {
        for (const m of set) {
          if (!Mark.exists(m, node.marks)) {
            editor.apply({ type: 'add_mark', path, mark: m })
          }
        }
      }
    })
  },

  removeMarks(
    editor: Editor,
    mark: Mark | Mark[],
    options: {
      at?: Location
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const at = splitLocation(editor, options)

      if (at) {
        const marks = Array.isArray(mark) ? mark : [mark]
        for (const [m, i, node, path] of Editor.marks(editor, { at })) {
          if (Mark.exists(m, marks)) {
            editor.apply({ type: 'remove_mark', path, mark: m })
          }
        }
      }
    })
  },

  setMarks(
    editor: Editor,
    mark: Mark | Mark[],
    props: Partial<Mark>,
    options: {
      at?: Location
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const at = splitLocation(editor, options)

      if (at) {
        const marks = Array.isArray(mark) ? mark : [mark]
        for (const [m, i, node, path] of Editor.marks(editor, { at })) {
          if (Mark.exists(m, marks)) {
            const newProps = {}

            for (const k in props) {
              if (props[k] !== m[k]) {
                newProps[k] = props[k]
              }
            }

            if (Object.keys(newProps).length > 0) {
              editor.apply({
                type: 'set_mark',
                path,
                properties: m,
                newProperties: newProps,
              })
            }
          }
        }
      }
    })
  },
}

/**
 * Split the text nodes at a range's edges to prepare for adding/removing marks.
 */

const splitLocation = (
  editor: Editor,
  options: {
    at?: Location
    hanging?: boolean
  } = {}
): Location | undefined => {
  let { at = editor.selection, hanging = false } = options

  if (!at) {
    return
  }

  if (Range.isRange(at)) {
    if (!hanging) {
      at = Editor.unhangRange(editor, at)
    }

    const rangeRef = Editor.rangeRef(editor, at, { affinity: 'inward' })
    const [start, end] = Range.edges(at)
    Editor.splitNodes(editor, { at: end, match: 'text' })
    Editor.splitNodes(editor, { at: start, match: 'text' })
    const range = rangeRef.unref()!

    if (options.at == null) {
      Editor.select(editor, range)
    }

    return range
  }

  return at
}
