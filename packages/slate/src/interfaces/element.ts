import {
  Ancestor,
  Descendant,
  Editor,
  ExtendedType,
  Node,
  Path,
  isObject,
} from '..'

/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 *
 * ## Element Behavior Types
 *
 * Element nodes behave differently depending on the [Slate editor's configuration](./editor.md#schema-specific-instance-methods-to-override). An element can be:
 *
 * - "block" or "inline" as defined by `editor.isInline`
 * - either "void" or "not void" as defined by `editor.isVoid`
 *
 * ### Block vs. Inline
 *
 * A "block" element can only be siblings with other "block" elements. An "inline" node can be siblings with `Text` nodes or other "inline" elements.
 *
 * ### Void vs Not Void
 *
 * In a not "void" element, Slate handles the rendering of its `children` (e.g. in a paragraph where the `Text` and `Inline` children are rendered by Slate). In a "void" element, the `children` are rendered by the `Element`'s render code.
 *
 * #### Voids That Support Marks
 *
 * Some void elements are effectively stand-ins for text, such as with the [Mentions](https://www.slatejs.org/examples/mentions) example, where the mention element renders the character's name. Users might want to format Void elements like this with bold, or set their font and size, so `editor.markableVoid` tells Slate whether or not to apply Marks to the text children of void elements.
 *
 * #### Rendering Void Elements
 *
 * Void Elements must
 *
 * - always have one empty child text node (for selection)
 * - render using `attributes` and `children` (so, their outermost HTML element **can't** be an HTML void element)
 * - set `contentEditable={false}` (for Firefox)
 *
 * @example
 * Typical rendering code will resemble this `thematic-break` (horizontal rule) element:
 *
 * ```javascript
 * return (
 *   <div {...attributes} contentEditable={false}>
 *     {children}
 *     <hr />
 *   </div>
 * )
 * ```
 *
 * @example
 * For a "markable" void such as a `mention` element, marks on the empty child element can be used to determine how the void element is rendered (Slate Marks are applied only to Text leaves):
 *
 * ```javascript
 * const Mention = ({ attributes, children, element }) => {
 *   const selected = useSelected()
 *   const focused = useFocused()
 *   const style: React.CSSProperties = {
 *     padding: '3px 3px 2px',
 *     margin: '0 1px',
 *     verticalAlign: 'baseline',
 *     display: 'inline-block',
 *     borderRadius: '4px',
 *     backgroundColor: '#eee',
 *     fontSize: '0.9em',
 *     boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
 *   }
 *   // See if our empty text child has any styling marks applied and apply those
 *   if (element.children[0].bold) {
 *     style.fontWeight = 'bold'
 *   }
 *   if (element.children[0].italic) {
 *     style.fontStyle = 'italic'
 *   }
 *   return (
 *     <span
 *       {...attributes}
 *       contentEditable={false}
 *       data-cy={`mention-${element.character.replace(' ', '-')}`}
 *       style={style}
 *     >
 *       {children}@{element.character}
 *     </span>
 *   )
 * }
 * ```
 */
export interface BaseElement {
  children: Descendant[]
}

export type Element = ExtendedType<'Element', BaseElement>

/** @hidden @inline */
export interface ElementIsElementOptions {
  deep?: boolean
}

export interface ElementInterface {
  /**
   * Check if a value implements the 'Ancestor' interface.
   * @param options Type also exported as `ElementIsElementOptions`
   * @category Type Guards
   */
  isAncestor(value: any, options?: ElementIsElementOptions): value is Ancestor

  /**
   * Check if a value implements the `Element` interface.
   * @param options Type also exported as `ElementIsElementOptions`
   * @category Type Guards
   */
  isElement(value: any, options?: ElementIsElementOptions): value is Element

  /**
   * Check if a value is an array of `Element` objects.
   * @param options Type also exported as `ElementIsElementOptions`
   * @category Type Guards
   */
  isElementList(
    value: any,
    options?: ElementIsElementOptions
  ): value is Element[]

  /**
   * Check if a set of props is a partial of Element.
   * @category Type Guards
   */
  isElementProps(props: any): props is Partial<Element>

  /**
   * Check if a value implements the `Element` interface and has elementKey with selected value.
   * Default it check to `type` key value
   * @category Type Guards
   */
  isElementType<T extends Element>(
    value: any,
    elementVal: string,
    elementKey?: string
  ): value is T

  /**
   * Check if an element matches set of properties.
   *
   * Note: this checks custom properties, and it does not ensure that any
   * children are equivalent.
   * @category Queries
   */
  matches(element: Element, props: Partial<Element>): boolean
}

/**
 * Shared the function with isElementType utility
 */
const isElement = (
  value: any,
  { deep = false }: ElementIsElementOptions = {}
): value is Element => {
  if (!isObject(value)) return false

  // PERF: No need to use the full Editor.isEditor here
  const isEditor = typeof value.apply === 'function'
  if (isEditor) return false

  const isChildrenValid = deep
    ? Node.isNodeList(value.children)
    : Array.isArray(value.children)

  return isChildrenValid
}

// eslint-disable-next-line no-redeclare
export const Element: ElementInterface = {
  isAncestor(
    value: any,
    { deep = false }: ElementIsElementOptions = {}
  ): value is Ancestor {
    return isObject(value) && Node.isNodeList(value.children, { deep })
  },

  isElement,

  isElementList(
    value: any,
    { deep = false }: ElementIsElementOptions = {}
  ): value is Element[] {
    return (
      Array.isArray(value) &&
      value.every(val => Element.isElement(val, { deep }))
    )
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
