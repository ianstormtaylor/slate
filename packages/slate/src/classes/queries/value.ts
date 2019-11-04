import { Editor, Range } from '../..'

class GeneralQueries {
  /**
   * Check if the editor's selection is expanded.
   */

  isExpanded(this: Editor) {
    const { selection } = this.value

    if (!selection) {
      throw new Error(
        `Cannot get the "expanded" state of the selection when the editor is not selected. Use \`editor.isSelected\` first.`
      )
    }

    return Range.isExpanded(selection)
  }

  /**
   * Check if the editor's selection is expanded.
   */

  isCollapsed(this: Editor) {
    const { selection } = this.value

    if (!selection) {
      throw new Error(
        `Cannot get the "collapsed" state of the selection when the editor is not selected. Use \`editor.isSelected\` first.`
      )
    }

    return Range.isExpanded(selection)
  }

  /**
   * Check if the editor is selected.
   */

  isSelected(this: Editor) {
    return !!this.value.selection
  }
}

export default GeneralQueries
