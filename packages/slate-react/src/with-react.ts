import { Editor, Node, Path, Operation, Command } from 'slate'

import { ReactEditor, ReactCommand } from '.'
import { Key } from './utils/key'
import { NODE_TO_KEY } from './utils/weak-maps'
import { EDITOR_TO_CONTEXT_LISTENER } from './hooks/use-slate'

/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 */

export const withReact = (editor: Editor): Editor => {
  const { apply, exec, onChange } = editor

  editor.apply = (op: Operation) => {
    const matches: [Path, Key][] = []

    switch (op.type) {
      case 'add_mark':
      case 'insert_text':
      case 'remove_mark':
      case 'remove_text':
      case 'set_mark':
      case 'set_node': {
        for (const [node, path] of Editor.levels(editor, { at: op.path })) {
          const key = ReactEditor.findKey(editor, node)
          matches.push([path, key])
        }

        break
      }

      case 'insert_node':
      case 'remove_node':
      case 'merge_node':
      case 'split_node': {
        for (const [node, path] of Editor.levels(editor, {
          at: Path.parent(op.path),
        })) {
          const key = ReactEditor.findKey(editor, node)
          matches.push([path, key])
        }

        break
      }

      case 'move_node': {
        // TODO
        break
      }
    }

    apply(op)

    for (const [path, key] of matches) {
      const [node] = Editor.node(editor, path)
      NODE_TO_KEY.set(node, key)
    }
  }

  editor.exec = (command: Command) => {
    if (ReactCommand.isInsertDataCommand(command)) {
      const { data } = command
      const fragment = data.getData('application/x-slate-fragment')

      if (fragment) {
        const decoded = decodeURIComponent(window.atob(fragment))
        const parsed = JSON.parse(decoded) as Node[]
        Editor.insertFragment(editor, parsed)
        return
      }

      const text = data.getData('text/plain')

      if (text) {
        const lines = text.split('\n')
        let split = false

        for (const line of lines) {
          if (split) {
            Editor.splitNodes(editor)
          }

          Editor.insertText(editor, line)
          split = true
        }
      }
    } else {
      exec(command)
    }
  }

  editor.onChange = (children: Node[], operations: Operation[]) => {
    const contextOnChange = EDITOR_TO_CONTEXT_LISTENER.get(editor)

    if (contextOnChange) {
      contextOnChange(children, operations)
    }

    onChange(children, operations)
  }

  return editor
}
