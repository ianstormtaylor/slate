import isPlainObject from 'is-plain-object'
import { Node } from '..'

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
}

/**
 * The `AddMarkCommand` adds properties to the text nodes in the selection.
 */

export interface AddMarkCommand {
  type: 'add_mark'
  key: string
  value: any
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
 * The `RemoveMarkCommand` removes properties from text nodes in the selection.
 */

export interface RemoveMarkCommand {
  type: 'remove_mark'
  key: string
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

export const CoreCommand = {
  /**
   * Check if a value is a `CoreCommand` object.
   */

  isCoreCommand(value: any): value is CoreCommand {
    if (Command.isCommand(value)) {
      switch (value.type) {
        case 'add_mark':
          return typeof value.key === 'string' && typeof value.value != null
        case 'delete_backward':
          return typeof value.unit === 'string'
        case 'delete_forward':
          return typeof value.unit === 'string'
        case 'delete_fragment':
          return true
        case 'insert_break':
          return true
        case 'insert_fragment':
          return Node.isNodeList(value.fragment)
        case 'insert_node':
          return Node.isNode(value.node)
        case 'insert_text':
          return typeof value.text === 'string'
        case 'remove_mark':
          return typeof value.key === 'string'
      }
    }

    return false
  },
}
