import { isPlainObject } from 'is-plain-object'
import { Element, createEditor as makeEditor } from 'slate'
import {
  createAnchor,
  createCursor,
  createEditor,
  createElement,
  createFocus,
  createFragment,
  createSelection,
  createText,
} from './creators'

/**
 * The default creators for Slate objects.
 */

const DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor(makeEditor),
  element: createElement,
  focus: createFocus,
  fragment: createFragment,
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
 * hyperscript tags for your domain.
 */

type HyperscriptShorthands = Record<string, Record<string, any>>

/**
 * Create a Slate hyperscript function with `options`.
 */

const createHyperscript = (
  options: {
    creators?: HyperscriptCreators
    elements?: HyperscriptShorthands
  } = {}
) => {
  const { elements = {} } = options
  const elementCreators = normalizeElements(elements)
  const creators = {
    ...DEFAULT_CREATORS,
    ...elementCreators,
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

export { createHyperscript, HyperscriptCreators, HyperscriptShorthands }
