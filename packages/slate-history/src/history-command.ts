export interface RedoCommand {
  type: 'redo'
}

export interface UndoCommand {
  type: 'undo'
}

export type HistoryCommand = RedoCommand | UndoCommand

const isCommand = (value: any): value is { type: string } => {
  return value != null && typeof value.type === 'string'
}

// eslint-disable-next-line no-redeclare
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
    return isCommand(value) && value.type === 'redo'
  },

  /**
   * Check if a value is an `UndoCommand` object.
   */

  isUndoCommand(value: any): value is UndoCommand {
    return isCommand(value) && value.type === 'undo'
  },
}
