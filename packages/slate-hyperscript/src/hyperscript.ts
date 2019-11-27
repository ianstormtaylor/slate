import isPlainObject from 'is-plain-object'
import { Element, Mark } from 'slate'
import {
  createAnchor,
  createCursor,
  createEditor,
  createElement,
  createFocus,
  createFragment,
  createMark,
  createSelection,
  createText,
} from './creators'

/**
 * The default creators for Slate objects.
 */

const DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor,
  element: createElement,
  focus: createFocus,
  fragment: createFragment,
  mark: createMark,
  selection: createSelection,
  text: createText,
}

/**
 * `HyperscriptCreators` are dictionaries of `HyperscriptCreator` functions
 * keyed by tag name.
 */

type HyperscriptCreators<T = any> = Record<
  string,
  (tagName: string, attributes: { [key: string]: any }, children: any[]) => T
>

/**
 * `HyperscriptShorthands` are dictionaries of properties applied to specific
 * kind of object, keyed by tag name. They allow you to easily define custom
 * hyperscript tags for your schema.
 */

type HyperscriptShorthands = Record<string, Record<string, any>>

/**
 * Create a Slate hyperscript function with `options`.
 */

const createHyperscript = (
  options: {
    creators?: HyperscriptCreators
    elements?: HyperscriptShorthands
    marks?: HyperscriptShorthands
  } = {}
) => {
  const { elements = {}, marks = {} } = options
  const elementCreators = normalizeElements(elements)
  const markCreators = normalizeMarks(marks)
  const creators = {
    ...DEFAULT_CREATORS,
    ...elementCreators,
    ...markCreators,
    ...options.creators,
  }

  const jsx = createFactory(creators)
  return jsx
}

/**
 * Create a Slate hyperscript function with `options`.
 */

const createFactory = <T extends HyperscriptCreators>(creators: T) => {
  const jsx = <S extends keyof T & string>(
    tagName: S,
    attributes?: Object,
    ...children: any[]
  ): ReturnType<T[S]> => {
    const creator = creators[tagName]

    if (!creator) {
      throw new Error(`No hyperscript creator found for tag: <${tagName}>`)
    }

    if (attributes == null) {
      attributes = {}
    }

    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children)
      attributes = {}
    }

    children = children.filter(child => Boolean(child)).flat()
    const ret = creator(tagName, attributes, children)
    return ret
  }

  return jsx
}

/**
 * Normalize a dictionary of element shorthands into creator functions.
 */

const normalizeElements = (elements: HyperscriptShorthands) => {
  const creators: HyperscriptCreators<Element> = {}

  for (const tagName in elements) {
    const props = elements[tagName]

    if (typeof props !== 'object') {
      throw new Error(
        `Properties specified for a hyperscript shorthand should be an object, but for the custom element <${tagName}>  tag you passed: ${props}`
      )
    }

    creators[tagName] = (
      tagName: string,
      attributes: { [key: string]: any },
      children: any[]
    ) => {
      return createElement('element', { ...props, ...attributes }, children)
    }
  }

  return creators
}

/**
 * Normalize a dictionary of mark shorthands into creator functions.
 */

const normalizeMarks = (marks: HyperscriptShorthands) => {
  const creators: HyperscriptCreators<Mark> = {}

  for (const tagName in marks) {
    const props = marks[tagName]

    if (typeof props !== 'object') {
      throw new Error(
        `Properties specified for a hyperscript shorthand should be an object, but for the custom mark <${tagName}> tag you passed: ${props}`
      )
    }

    creators[tagName] = (
      tagName: string,
      attributes: { [key: string]: any },
      children: any[]
    ) => {
      return createMark('mark', { ...props, ...attributes }, children)
    }
  }

  return creators
}

export { createHyperscript, HyperscriptCreators, HyperscriptShorthands }
