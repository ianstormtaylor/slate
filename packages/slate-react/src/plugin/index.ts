import { EditorConstructor, Editor as CoreEditor } from 'slate'

import ReactEditorCommands from './commands'
import ReactEditorQueries from './queries'
import ReactEditorDomHelpers from './dom-helpers'

/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 */

export const withReact = (
  Base: EditorConstructor
): EditorConstructor<ReactEditor> => {
  class E extends Base {}

  interface E
    extends ReactEditorCommands,
      ReactEditorDomHelpers,
      ReactEditorQueries {}

  const mixin = (Mixins: Array<new () => any>) => {
    for (const Mixin of Mixins) {
      for (const key of Object.getOwnPropertyNames(Mixin.prototype)) {
        if (key !== 'constructor') {
          E.prototype[key] = Mixin.prototype[key]
        }
      }
    }
  }

  mixin([ReactEditorCommands, ReactEditorDomHelpers, ReactEditorQueries])

  return E
}

/**
 * `ReactEditor` is a Slate editor interface with the React mixin applied.
 */

export interface ReactEditor
  extends CoreEditor,
    ReactEditorCommands,
    ReactEditorDomHelpers,
    ReactEditorQueries {}
