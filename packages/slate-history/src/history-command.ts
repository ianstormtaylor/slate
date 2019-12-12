import { Command } from 'slate'

export interface RedoCommand {
  type: 'redo'
}

export interface UndoCommand {
  type: 'undo'
}

export type HistoryCommand = RedoCommand | UndoCommand

export const HistoryCommand = {
  /**
   * Check if a value is a `HistoryCommand` object.
   */

  isHistoryCommand(value: any): value is HistoryCommand {
    if (Command.isCommand(value)) {
      switch (value.type) {
        case 'redo':
        case 'undo':
          return true
      }
    }

    return false
  },
}
