import isPlainObject from 'is-plain-object'
import { Mark, Node, Range } from '..'

export interface AddAnnotationCommand {
  type: 'add_annotation'
  key: string
  properties: Record<string, any>
}

export interface AddMarkCommand {
  type: 'add_mark'
  mark: Mark
}

export interface DeselectCommand {
  type: 'deselect'
}

export interface DeleteBackwardCommand {
  type: 'delete_backward'
  unit: 'character' | 'word' | 'line' | 'block'
}

export interface DeleteForwardCommand {
  type: 'delete_forward'
  unit: 'character' | 'word' | 'line' | 'block'
}

export interface DeleteFragmentCommand {
  type: 'delete_fragment'
}

export interface InsertTextCommand {
  type: 'insert_text'
  text: string
}

export interface InsertFragmentCommand {
  type: 'insert_fragment'
  fragment: Node[]
}

export interface InsertBreakCommand {
  type: 'insert_break'
}

export interface RemoveAnnotationCommand {
  type: 'remove_annotation'
  key: string
}

export interface RemoveMarkCommand {
  type: 'remove_mark'
  mark: Mark
}

export interface SelectCommand {
  type: 'select'
  range: Range
}

export type CoreCommand =
  | AddAnnotationCommand
  | AddMarkCommand
  | DeselectCommand
  | DeleteBackwardCommand
  | DeleteForwardCommand
  | DeleteFragmentCommand
  | InsertTextCommand
  | InsertFragmentCommand
  | InsertBreakCommand
  | RemoveAnnotationCommand
  | RemoveMarkCommand
  | SelectCommand

export interface Command {
  type: string
  [key: string]: any
}

export const Command = {
  /**
   * Check if a value is a `Command` object.
   */

  isCommand(value: any): value is Command {
    return isPlainObject(value) && typeof value.type === 'string'
  },

  /**
   * Check if a value is an `AddAnnotationCommand` object.
   */

  isAddAnnotationCommand(value: any): value is AddAnnotationCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'add_annotation' &&
      typeof value.key === 'string' &&
      isPlainObject(value.properties)
    )
  },

  /**
   * Check if a value is an `AddMarkCommand` object.
   */

  isAddMarkCommand(value: any): value is AddMarkCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'add_mark' &&
      Mark.isMark(value.mark)
    )
  },

  /**
   * Check if a value is a `CoreCommand` object.
   */

  isCoreCommand(value: any): value is CoreCommand {
    return (
      Command.isAddAnnotationCommand(value) ||
      Command.isAddMarkCommand(value) ||
      Command.isDeselectCommand(value) ||
      Command.isDeleteBackwardCommand(value) ||
      Command.isDeleteForwardCommand(value) ||
      Command.isInsertTextCommand(value) ||
      Command.isInsertFragmentCommand(value) ||
      Command.isInsertBreakCommand(value) ||
      Command.isRemoveAnnotationCommand(value) ||
      Command.isRemoveMarkCommand(value) ||
      Command.isSelectCommand(value)
    )
  },

  /**
   * Check if a value is a `DeselectCommand` object.
   */

  isDeselectCommand(value: any): value is DeselectCommand {
    return Command.isCommand(value) && value.type === 'deselect'
  },

  /**
   * Check if a value is a `DeleteBackwardCommand` object.
   */

  isDeleteBackwardCommand(value: any): value is DeleteBackwardCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'delete_backward' &&
      typeof value.unit === 'string'
    )
  },

  /**
   * Check if a value is a `DeleteForwardCommand` object.
   */

  isDeleteForwardCommand(value: any): value is DeleteForwardCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'delete_forward' &&
      typeof value.unit === 'string'
    )
  },

  /**
   * Check if a value is a `InsertTextCommand` object.
   */

  isInsertTextCommand(value: any): value is InsertTextCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'insert_text' &&
      typeof value.text === 'string'
    )
  },

  /**
   * Check if a value is an `InsertFragmentCommand` object.
   */

  isInsertFragmentCommand(value: any): value is InsertFragmentCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'insert_fragment' &&
      Node.isNodeList(value.fragment)
    )
  },

  /**
   * Check if a value is an `InsertBreakCommand` object.
   */

  isInsertBreakCommand(value: any): value is InsertBreakCommand {
    return Command.isCommand(value) && value.type === 'insert_break'
  },

  /**
   * Check if a value is a `RemoveAnnotationCommand` object.
   */

  isRemoveAnnotationCommand(value: any): value is RemoveAnnotationCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'remove_annotation' &&
      typeof value.key === 'string'
    )
  },

  /**
   * Check if a value is a `RemoveMarkCommand` object.
   */

  isRemoveMarkCommand(value: any): value is RemoveMarkCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'remove_mark' &&
      Mark.isMark(value.mark)
    )
  },

  /**
   * Check if a value is a `SelectCommand` object.
   */

  isSelectCommand(value: any): value is SelectCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'select' &&
      Range.isRange(value.range)
    )
  },
}
