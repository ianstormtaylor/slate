import { Command } from 'slate'

/**
 * The `InsertDataCommand` inserts content from a `DataTransfer` object.
 */

export interface InsertDataCommand {
  type: 'insert_data'
  data: DataTransfer
}

/**
 * The `ReactCommand` union for all commands that the React plugins defines.
 */

export type ReactCommand = InsertDataCommand

export const ReactCommand = {
  /**
   * Check if a value is an `InsertDataCommand` object.
   */

  isInsertDataCommand(value: any): value is InsertDataCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'insert_data' &&
      value.data instanceof DataTransfer
    )
  },

  /**
   * Check if a value is a `ReactCommand` object.
   */

  isReactCommand(value: any): value is InsertDataCommand {
    return ReactCommand.isInsertDataCommand(value)
  },
}
