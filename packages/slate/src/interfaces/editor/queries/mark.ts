import { Editor, Mark, MarkEntry, MarkMatch } from '../../..'

export const MarkQueries = {
  /**
   * Check if a mark entry is a match.
   */

  isMarkMatch(editor: Editor, entry: MarkEntry, match: MarkMatch): boolean {
    if (Array.isArray(match)) {
      return match.some(m => Editor.isMarkMatch(editor, entry, m))
    } else if (typeof match === 'function') {
      return match(entry)
    } else {
      return Mark.matches(entry[0], match)
    }
  },
}
