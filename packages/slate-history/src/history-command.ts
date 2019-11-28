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
    return (
      HistoryCommand.isRedoCommand(value) || HistoryCommand.isUndoCommand(value)
    )
  },

  /**
   * Check if a value is a `RedoCommand` object.
   */

  isRedoCommand(value: any): value is RedoCommand {
    return Command.isCommand(value) && value.type === 'redo'
  },

  /**
   * Check if a value is an `UndoCommand` object.
   */

  isUndoCommand(value: any): value is UndoCommand {
    return Command.isCommand(value) && value.type === 'undo'
  },
}
