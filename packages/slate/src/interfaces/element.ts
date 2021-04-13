import isPlainObject from 'is-plain-object'
import { Editor, Node, Path, Descendant, ExtendedType, Ancestor } from '..'

/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */

export interface BaseElement {
  children: Descendant[]
}

export type Element = ExtendedType<'Element', BaseElement>

export interface ElementInterface {
  isAncestor: (value: any) => value is Ancestor
  isElement: (value: any) => value is Element
  isElementList: (value: any) => value is Element[]
  isElementProps: (props: any) => props is Partial<Element>
  matches: (element: Element, props: Partial<Element>) => boolean
}

export const Element: ElementInterface = {
  /**
   * Check if a value implements the 'Ancestor' interface.
   */

  isAncestor(value: any): value is Ancestor {
    return isPlainObject(value) && Node.isNodeList(value.children)
  },

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
   * Check if a set of props is a partial of Element.
   */

  isElementProps(props: any): props is Partial<Element> {
    return (props as Partial<Element>).children !== undefined
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
