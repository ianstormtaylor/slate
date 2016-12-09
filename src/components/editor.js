
import Content from './content'
import Debug from 'debug'
import React from 'react'
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
    className: React.PropTypes.string,
    onBeforeChange: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onDocumentChange: React.PropTypes.func,
    onSelectionChange: React.PropTypes.func,
    placeholder: React.PropTypes.any,
    placeholderClassName: React.PropTypes.string,
    placeholderStyle: React.PropTypes.object,
    plugins: React.PropTypes.array,
    readOnly: React.PropTypes.bool,
    schema: React.PropTypes.object,
    spellCheck: React.PropTypes.bool,
    state: React.PropTypes.instanceOf(State).isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    onChange: noop,
    onDocumentChange: noop,
    onSelectionChange: noop,
    plugins: [],
    readOnly: false,
    schema: {},
    spellCheck: true
  };

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
    for (const method of EVENT_HANDLERS) {
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
    for (const prop of PLUGINS_PROPS) {
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

    state = stack.onChange(state, this)
    onChange(state)
    if (state.document != tmp.document) onDocumentChange(state.document, state)
    if (state.selection != tmp.selection) onSelectionChange(state.selection, state)

    this.cacheState(state)
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render = () => {
    const { props, state } = this
    const handlers = {}

    for (const property of EVENT_HANDLERS) {
      handlers[property] = this[property]
    }

    debug('render', { props, state })

    return (
      <Content
        {...handlers}
        editor={this}
        onChange={this.onChange}
        schema={this.getSchema()}
        state={this.getState()}
        className={props.className}
        readOnly={props.readOnly}
        spellCheck={props.spellCheck}
        style={props.style}
      />
    )
  }

}

/**
 * Mix in the property types for the event handlers.
 */

for (const property of EVENT_HANDLERS) {
  Editor.propTypes[property] = React.PropTypes.func
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
