
import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import Types from 'prop-types'

import Stack from '../models/stack'
import SlatePropTypes from '../utils/prop-types'
import noop from '../utils/noop'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:editor')

/**
 * Event handlers to mix in to the editor.
 *
 * @type {Array}
 */

const EVENT_HANDLERS = [
  'onBeforeInput',
  'onBlur',
  'onFocus',
  'onCopy',
  'onCut',
  'onDrop',
  'onKeyDown',
  'onPaste',
  'onSelect',
]

/**
 * Plugin-related properties of the editor.
 *
 * @type {Array}
 */

const PLUGINS_PROPS = [
  ...EVENT_HANDLERS,
  'placeholder',
  'placeholderClassName',
  'placeholderStyle',
  'plugins',
  'schema',
]

/**
 * Editor.
 *
 * @type {Component}
 */

class Editor extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    autoCorrect: Types.bool,
    autoFocus: Types.bool,
    className: Types.string,
    onBeforeChange: Types.func,
    onChange: Types.func,
    onDocumentChange: Types.func,
    onSelectionChange: Types.func,
    placeholder: Types.any,
    placeholderClassName: Types.string,
    placeholderStyle: Types.object,
    plugins: Types.array,
    readOnly: Types.bool,
    role: Types.string,
    schema: Types.object,
    spellCheck: Types.bool,
    state: SlatePropTypes.state.isRequired,
    style: Types.object,
    tabIndex: Types.number,
  }

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    autoFocus: false,
    autoCorrect: true,
    onChange: noop,
    onDocumentChange: noop,
    onSelectionChange: noop,
    plugins: [],
    readOnly: false,
    schema: {},
    spellCheck: true,
  }

  /**
   * When constructed, create a new `Stack` and run `onBeforeChange`.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.state = {}

    // Create a new `Stack`, omitting the `onChange` property since that has
    // special significance on the editor itself.
    const { onChange, ...rest } = props // eslint-disable-line no-unused-vars
    const stack = Stack.create(rest)
    this.state.stack = stack

    // Resolve the state, running `onBeforeChange` first.
    const state = stack.onBeforeChange(props.state, this)
    this.cacheState(state)
    this.state.state = state

    // Create a bound event handler for each event.
    for (let i = 0; i < EVENT_HANDLERS.length; i++) {
      const method = EVENT_HANDLERS[i]
      this[method] = (...args) => {
        const next = this.state.stack[method](this.state.state, this, ...args)
        this.onChange(next)
      }
    }
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary, and
   * run `onBeforeChange`.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    let { stack } = this.state

    // If any plugin-related properties will change, create a new `Stack`.
    for (let i = 0; i < PLUGINS_PROPS.length; i++) {
      const prop = PLUGINS_PROPS[i]
      if (props[prop] == this.props[prop]) continue
      const { onChange, ...rest } = props // eslint-disable-line no-unused-vars
      stack = Stack.create(rest)
      this.setState({ stack })
    }

    // Resolve the state, running the before change handler of the stack.
    const state = stack.onBeforeChange(props.state, this)
    this.cacheState(state)
    this.setState({ state })
  }

  /**
   * Cache a `state` in memory to be able to compare against it later, for
   * things like `onDocumentChange`.
   *
   * @param {State} state
   */

  cacheState = (state) => {
    this.tmp.document = state.document
    this.tmp.selection = state.selection
  }

  /**
   * Programmatically blur the editor.
   */

  blur = () => {
    const state = this.state.state
      .transform()
      .blur()
      .apply()

    this.onChange(state)
  }

  /**
   * Programmatically focus the editor.
   */

  focus = () => {
    const state = this.state.state
      .transform()
      .focus()
      .apply()

    this.onChange(state)
  }

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  getSchema = () => {
    return this.state.stack.schema
  }

  /**
   * Get the editor's current state.
   *
   * @return {State}
   */

  getState = () => {
    return this.state.state
  }

  /**
   * When the `state` changes, pass through plugins, then bubble up.
   *
   * @param {State} state
   */

  onChange = (state) => {
    if (state == this.state.state) return
    const { tmp, props } = this
    const { stack } = this.state
    const { onChange, onDocumentChange, onSelectionChange } = props
    const { document, selection } = tmp

    state = stack.onChange(state, this)
    onChange(state)
    if (state.document != document) onDocumentChange(state.document, state)
    if (state.selection != selection) onSelectionChange(state.selection, state)
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render() {
    const { props, state } = this
    const { stack } = state
    const children = stack
      .renderPortal(state.state, this)
      .map((child, i) => <Portal key={i} isOpened>{child}</Portal>)

    debug('render', { props, state })

    const tree = stack.render(state.state, this, { ...props, children })
    return tree
  }

}

/**
 * Mix in the property types for the event handlers.
 */

for (let i = 0; i < EVENT_HANDLERS.length; i++) {
  const property = EVENT_HANDLERS[i]
  Editor.propTypes[property] = Types.func
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
