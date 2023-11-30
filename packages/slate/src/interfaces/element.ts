import { isPlainObject } from 'is-plain-object'
import { Ancestor, Descendant, Editor, ExtendedType, Node, Path } from '..'

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
  /**
   * Check if a value implements the 'Ancestor' interface.
   */
  isAncestor: (value: any) => value is Ancestor

  /**
   * Check if a value implements the `Element` interface.
   */
  isElement: (value: any) => value is Element

  /**
   * Check if a value is an array of `Element` objects.
   */
  isElementList: (value: any) => value is Element[]

  /**
   * Check if a set of props is a partial of Element.
   */
  isElementProps: (props: any) => props is Partial<Element>

  /**
   * Check if a value implements the `Element` interface and has elementKey with selected value.
   * Default it check to `type` key value
   */
  isElementType: <T extends Element>(
    value: any,
    elementVal: string,
    elementKey?: string
  ) => value is T

  /**
   * Check if an element matches set of properties.
   *
   * Note: this checks custom properties, and it does not ensure that any
   * children are equivalent.
   */
  matches: (element: Element, props: Partial<Element>) => boolean
}

/**
 * Shared the function with isElementType utility
 */
const isElement = (value: any): value is Element => {
  return (
    isPlainObject(value) &&
    Node.isNodeList(value.children) &&
    !Editor.isEditor(value)
  )
}

// eslint-disable-next-line no-redeclare
export const Element: ElementInterface = {
  isAncestor(value: any): value is Ancestor {
    return isPlainObject(value) && Node.isNodeList(value.children)
  },

  isElement,

  isElementList(value: any): value is Element[] {
    return Array.isArray(value) && value.every(val => Element.isElement(val))
  },

  isElementProps(props: any): props is Partial<Element> {
    return (props as Partial<Element>).children !== undefined
  },

  isElementType: <T extends Element>(
    value: any,
    elementVal: string,
    elementKey: string = 'type'
  ): value is T => {
    return (
      isElement(value) && value[<keyof Descendant>elementKey] === elementVal
    )
  },

  matches(element: Element, props: Partial<Element>): boolean {
    for (const key in props) {
      if (key === 'children') {
        continue
      }

      if (element[<keyof Descendant>key] !== props[<keyof Descendant>key]) {
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
