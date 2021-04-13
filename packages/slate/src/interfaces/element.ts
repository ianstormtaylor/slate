import isPlainObject from 'is-plain-object'
import { Editor, Node, Path, Text, Value } from '..'
import { DescendantOf, NodeOf } from './node'

/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */

export type ElementEntry = [Element, Path]

/**
 * A utility type to get all the element nodes type from a root node.
 */

export type ElementOf<N extends Node> = Editor<Value> extends N
  ? Element
  : Element extends N
  ? Element
  : N extends Editor<Value>
  ? Extract<N['children'][number], Element> | ElementOf<N['children'][number]>
  : N extends Element
  ?
      | N
      | Extract<N['children'][number], Element>
      | ElementOf<N['children'][number]>
  : never

/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */

export interface Element {
  children: Array<Element | Text>
  [key: string]: unknown
}

export const Element = {
  /**
   * Check if a value implements the `Element` interface.
   */

  isElement(value: any): value is Element {
    return (
      isPlainObject(value) &&
      Node.isNodeList(value.children) &&
      !Editor.isEditor(value)
    )
  },

  /**
   * Check if a value is an array of `Element` objects.
   */

  isElementList(value: any): value is Element[] {
    return Array.isArray(value) && value.every(val => Element.isElement(val))
  },

  /**
   * Check if an element matches set of properties.
   *
   * Note: this checks custom properties, and it does not ensure that any
   * children are equivalent.
   */

  matches(element: Element, props: object): boolean {
    for (const key in props) {
      if (key === 'children') {
        continue
      }

      if (element[key] !== props[key]) {
        return false
      }
    }

    return true
  },
}
