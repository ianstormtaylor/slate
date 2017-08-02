
import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import Types from 'prop-types'

import Stack from '../models/stack'
import State from '../models/state'
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
    onBeforeTransform: Types.func,
    onChange: Types.func,
    onDocumentChange: Types.func,
    onSelectionChange: Types.func,
    onTransform: Types.func,
    placeholder: Types.any,
    placeholderClassName: Types.string,
    placeholderStyle: Types.object,
    plugins: Types.array,
    readOnly: Types.bool,
    role: Types.string,
    schema: Types.object,
    spellCheck: Types.bool,
    state: Types.instanceOf(State).isRequired,
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
    const { state, onChange, ...rest } = props // eslint-disable-line no-unused-vars
    const stack = Stack.create(rest)
    this.state.stack = stack

    // Cache and set the state.
    this.cacheState(state)
    this.state.state = state

    // Create a bound event handler for each event.
    for (const method of EVENT_HANDLERS) {
      this[method] = (...args) => {
        const stk = this.state.stack
        const transform = this.state.state.transform()
        stk[method](transform, this, ...args)
        stk.onBeforeTransform(transform, this)
        stk.onTransform(transform, this)
        this.onChange(transform)
      }
    }
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    const { state } = props

    // If any plugin-related properties will change, create a new `Stack`.
    for (const prop of PLUGINS_PROPS) {
      if (props[prop] == this.props[prop]) continue
      const { onChange, ...rest } = props // eslint-disable-line no-unused-vars
      const stack = Stack.create(rest)
      this.setState({ stack })
    }

    // Cache and save the state.
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
    this.transform(t => t.blur())
  }

  /**
   * Programmatically focus the editor.
   */

  focus = () => {
    this.transform(t => t.focus())
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
   * Perform a transform `fn` on the editor's current state.
   *
   * @param {Function} fn
   */

  transform = (fn) => {
    const transform = this.state.state.transform()
    fn(transform)
    this.onChange(transform)
  }

  /**
   * On change.
   *
   * @param {Transform} transform
   */

  onChange = (transform) => {
    if (transform instanceof State) {
      throw new Error('As of slate@0.21.0 the `editor.onChange` method must be passed a `Transform` not a `State`.')
    }

    const { onChange, onDocumentChange, onSelectionChange } = this.props
    const { document, selection } = this.tmp
    const next = transform.apply()
    if (next == this.state.state) return

    onChange(transform)
    if (next.document != document) onDocumentChange(next.document, transform)
    if (next.selection != selection) onSelectionChange(next.selection, transform)
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render = () => {
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

for (const property of EVENT_HANDLERS) {
  Editor.propTypes[property] = Types.func
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
