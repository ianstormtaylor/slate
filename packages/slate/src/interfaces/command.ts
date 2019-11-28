import isPlainObject from 'is-plain-object'
import { Mark, Node, Range } from '..'

/**
 * `Command` objects represent an action that a user is taking on the editor.
 * They capture the semantic "intent" of a user while they edit a document.
 */

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
      Command.isAddMarkCommand(value) ||
      Command.isDeleteBackwardCommand(value) ||
      Command.isDeleteForwardCommand(value) ||
      Command.isDeleteFragmentCommand(value) ||
      Command.isInsertTextCommand(value) ||
      Command.isInsertFragmentCommand(value) ||
      Command.isInsertBreakCommand(value) ||
      Command.isRemoveMarkCommand(value)
    )
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
   * Check if a value is a `DeleteFragmentCommand` object.
   */

  isDeleteFragmentCommand(value: any): value is DeleteFragmentCommand {
    return Command.isCommand(value) && value.type === 'delete_fragment'
  },

  /**
   * Check if a value is an `InsertBreakCommand` object.
   */

  isInsertBreakCommand(value: any): value is InsertBreakCommand {
    return Command.isCommand(value) && value.type === 'insert_break'
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
   * Check if a value is an `InsertNodeCommand` object.
   */

  isInsertNodeCommand(value: any): value is InsertNodeCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'insert_node' &&
      Node.isNode(value.node)
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
   * Check if a value is a `RemoveMarkCommand` object.
   */

  isRemoveMarkCommand(value: any): value is RemoveMarkCommand {
    return (
      Command.isCommand(value) &&
      value.type === 'remove_mark' &&
      Mark.isMark(value.mark)
    )
  },
}

/**
 * The `AddMarkCommand` adds a mark to the current selection.
 */

export interface AddMarkCommand {
  type: 'add_mark'
  mark: Mark
}

/**
 * The `DeleteBackwardCommand` delete's content backward, meaning before the
 * current selection, by a specific `unit` of distance.
 */

export interface DeleteBackwardCommand {
  type: 'delete_backward'
  unit: 'character' | 'word' | 'line' | 'block'
}

/**
 * The `DeleteBackwardCommand` delete's content forward, meaning after the
 * current selection, by a specific `unit` of distance.
 */

export interface DeleteForwardCommand {
  type: 'delete_forward'
  unit: 'character' | 'word' | 'line' | 'block'
}

/**
 * The `DeleteFragmentCommand` delete's the content of the current selection.
 */

export interface DeleteFragmentCommand {
  type: 'delete_fragment'
}

/**
 * The `InsertBreakCommand` breaks a block in two at the current selection.
 */

export interface InsertBreakCommand {
  type: 'insert_break'
}

/**
 * The `InsertFragmentCommand` inserts a list of nodes at the current selection.
 */

export interface InsertFragmentCommand {
  type: 'insert_fragment'
  fragment: Node[]
}

/**
 * The `InsertNodeCommand` inserts a node at the current selection.
 */

export interface InsertNodeCommand {
  type: 'insert_node'
  node: Node
}

/**
 * The `InsertTextCommand` inserts a string of text at the current selection.
 */

export interface InsertTextCommand {
  type: 'insert_text'
  text: string
}

/**
 * The `RemoveMarkCommand` removes a mark in the current selection.
 */

export interface RemoveMarkCommand {
  type: 'remove_mark'
  mark: Mark
}

/**
 * The `CoreCommand` union is a set of all of the commands that are recognized
 * by Slate's "core" out of the box.
 */

export type CoreCommand =
  | AddMarkCommand
  | DeleteBackwardCommand
  | DeleteForwardCommand
  | DeleteFragmentCommand
  | InsertBreakCommand
  | InsertFragmentCommand
  | InsertNodeCommand
  | InsertTextCommand
  | RemoveMarkCommand
