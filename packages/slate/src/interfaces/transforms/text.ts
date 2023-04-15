import { Editor, Location, Node, Path, Range, Transforms } from '../../index'
import { TextUnit } from '../../types/types'

export interface TextDeleteOptions {
  at?: Location
  distance?: number
  unit?: TextUnit
  reverse?: boolean
  hanging?: boolean
  voids?: boolean
}

export interface TextInsertFragmentOptions {
  at?: Location
  hanging?: boolean
  voids?: boolean
}

export interface TextInsertTextOptions {
  at?: Location
  voids?: boolean
}

export interface TextTransforms {
  /**
   * Delete content in the editor.
   */
  delete: (editor: Editor, options?: TextDeleteOptions) => void

  /**
   * Insert a fragment at a specific location in the editor.
   */
  insertFragment: (
    editor: Editor,
    fragment: Node[],
    options?: TextInsertFragmentOptions
  ) => void

  /**
   * Insert a string of text in the Editor.
   */
  insertText: (
    editor: Editor,
    text: string,
    options?: TextInsertTextOptions
  ) => void
}

// eslint-disable-next-line no-redeclare
export const TextTransforms: TextTransforms = {
  delete(editor, options) {
    editor.delete(options)
  },
  insertFragment(editor, fragment, options) {
    editor.insertFragment(fragment, options)
  },
  insertText(
    editor: Editor,
    text: string,
    options: TextInsertTextOptions = {}
  ): void {
    Editor.withoutNormalizing(editor, () => {
      const { voids = false } = options
      let { at = editor.selection } = options

      if (!at) {
        return
      }

      if (Path.isPath(at)) {
        at = Editor.range(editor, at)
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const end = Range.end(at)
          if (!voids && Editor.void(editor, { at: end })) {
            return
          }
          const start = Range.start(at)
          const startRef = Editor.pointRef(editor, start)
          const endRef = Editor.pointRef(editor, end)
          Transforms.delete(editor, { at, voids })
          const startPoint = startRef.unref()
          const endPoint = endRef.unref()

          at = startPoint || endPoint!
          Transforms.setSelection(editor, { anchor: at, focus: at })
        }
      }

      if (
        (!voids && Editor.void(editor, { at })) ||
        Editor.elementReadOnly(editor, { at })
      ) {
        return
      }

      const { path, offset } = at
      if (text.length > 0)
        editor.apply({ type: 'insert_text', path, offset, text })
    })
  },
}
