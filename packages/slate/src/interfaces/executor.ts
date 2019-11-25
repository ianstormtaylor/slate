import { Editor, Command } from '..'

/**
 * `Executor` functions take an editor and a command an determine what behavior
 * to perform on the editor's state.
 */

export interface Executor {
  (editor: Editor, command: Command): void
}
