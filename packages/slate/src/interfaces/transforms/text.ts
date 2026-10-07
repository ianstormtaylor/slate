import { Editor, Location, Node, Range, Transforms } from '../../index'
import { TextUnit } from '../../types/types'
import { getDefaultInsertLocation } from '../../utils'

/** @hidden @inline */
export interface TextDeleteOptions {
  /**
   * The location to delete content from. Defaults to the current selection. If there is no selection, nothing is deleted.
   */
  at?: Location
  distance?: number
  unit?: TextUnit
  reverse?: boolean
  hanging?: boolean
  voids?: boolean
}

/** @hidden @inline */
export interface TextInsertFragmentOptions {
  /**
   * The location to insert the fragment.
   * @default The current selection. If there is no selection, nothing is deleted.
   */
  at?: Location
  hanging?: boolean
  voids?: boolean
  batchDirty?: boolean
}

/** @hidden @inline */
export interface TextInsertTextOptions {
  at?: Location
  voids?: boolean
}

export interface TextTransforms {
  /**
   * Delete content in the editor.
   */
  delete(editor: Editor, options?: TextDeleteOptions): void

  /**
   * Insert a fragment in the editor
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   */
  insertFragment(
    editor: Editor,
    fragment: Node[],
    options?: TextInsertFragmentOptions
  ): void

  /**
   * Insert a string of text in the editor
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   */
  insertText(
    editor: Editor,
    text: string,
    options?: TextInsertTextOptions
  ): void
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
      let { at = getDefaultInsertLocation(editor) } = options

      if (Location.isPath(at)) {
        at = Editor.range(editor, at)
      }

      if (Location.isRange(at)) {
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
