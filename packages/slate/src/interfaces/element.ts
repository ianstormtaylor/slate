import isPlainObject from 'is-plain-object'
import { Editor, Node, Path } from '..'

/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */

export interface Element {
  children: Node[]
  [key: string]: any
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
    return (
      Array.isArray(value) &&
      (value.length === 0 || Element.isElement(value[0]))
    )
  },

  /**
   * Check if an element matches set of properties.
   *
   * Note: this checks custom properties, and it does not ensure that any
   * children are equivalent.
   */

  matches(element: Element, props: Partial<Element>): boolean {
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

/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */

export type ElementEntry = [Element, Path]
