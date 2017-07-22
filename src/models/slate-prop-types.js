import Block from './block'
import Character from './character'
import Document from './document'
import Inline from './inline'
import Mark from './mark'
import Range from './range'
import Schema from './schema'
import Selection from './selection'
import State from './state'
import Text from './text'

/**
 * HOC Function that takes in a predicate prop type function, and allows an isRequired chain
 *
 * @param {Function} predicate
 * @return {Function}
 */

function createChainablePropType(predicate) {
  function propType(props, propName, componentName) {
    if (props[propName] == null) return

    return predicate(props, propName, componentName)
  }

  propType.isRequired = (props, propName, componentName) => {
    if (props[propName] == null) return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`)

    return predicate(props, propName, componentName)
  }

  return propType
}

/**
 * Exported Slate proptype that checks if a prop is a Slate Block
 *
 * @type {Function}
 */

const slateBlock = createChainablePropType(
  (props, propName, componentName) => {
    return !Block.isBlock(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Block`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Character
 *
 * @type {Function}
 */

const slateCharacter = createChainablePropType(
  (props, propName, componentName) => {
    return !Character.isCharacter(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Character`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Document
 *
 * @type {Function}
 */

const slateDocument = createChainablePropType(
  (props, propName, componentName) => {
    return !Document.isDocument(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Document`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Inline
 *
 * @type {Function}
 */

const slateInline = createChainablePropType(
  (props, propName, componentName) => {
    return !Inline.isInline(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Inline`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Mark
 *
 * @type {Function}
 */

const slateMark = createChainablePropType(
  (props, propName, componentName) => {
    return !Mark.isMark(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Mark`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Range
 *
 * @type {Function}
 */

const slateRange = createChainablePropType(
  (props, propName, componentName) => {
    return !Range.isRange(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Range`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Schema
 *
 * @type {Function}
 */

const slateSchema = createChainablePropType(
  (props, propName, componentName) => {
    return !Schema.isSchema(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Schema`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Selection
 *
 * @type {Function}
 */

const slateSelection = createChainablePropType(
  (props, propName, componentName) => {
    return !Selection.isSelection(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Selection`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate State
 *
 * @type {Function}
 */

const slateState = createChainablePropType(
  (props, propName, componentName) => {
    return !State.isState(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate State`) : null
  }
)

/**
 * Exported Slate proptype that checks if a prop is a Slate Text
 *
 * @type {Function}
 */

const slateText = createChainablePropType(
  (props, propName, componentName) => {
    return !Text.isText(props[propName]) ? new Error(`${propName} in ${componentName} is not a Slate Text`) : null
  }
)

/**
 * Exported Slate proptypes
 *
 * @type {Object}
 */

export default {
  slateBlock,
  slateCharacter,
  slateDocument,
  slateInline,
  slateMark,
  slateRange,
  slateSchema,
  slateSelection,
  slateState,
  slateText,
}
