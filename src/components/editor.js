
import Content from './content'
import CorePlugin from '../plugins/core'
import Debug from 'debug'
import React from 'react'
import Schema from '../models/schema'

/**
 * Debug.
 */

const debug = Debug('slate:editor')

/**
 * Noop.
 *
 * @type {Function}
 */

function noop() {}

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
  'onSelect'
]

/**
 * Editor.
 *
 * @type {Component}
 */

class Editor extends React.Component {

  /**
   * Properties.
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
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
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
   * When created, compute the plugins from `props`.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.state = {}
    this.state.plugins = this.resolvePlugins(props)
    this.state.schema = this.resolveSchema(this.state.plugins)
    this.state.state = this.onBeforeChange(props.state)

    // Mix in the event handlers.
    for (const method of EVENT_HANDLERS) {
      this[method] = (...args) => {
        this.onEvent(method, ...args)
      }
    }
  }

  /**
   * When the `props` are updated, recompute the state and plugins.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    if (props.plugins != this.props.plugins) {
      const plugins = this.resolvePlugins(props)
      const schema = this.resolveSchema(plugins)
      this.setState({ plugins, schema })
    }

    else if (props.schema != this.props.schema) {
      const schema = this.resolveSchema(this.state.plugins)
      this.setState({ schema })
    }

    this.setState({
      state: this.onBeforeChange(props.state)
    })
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
   * Get the editor's current `schema`.
   *
   * @return {Schema}
   */

  getSchema = () => {
    return this.state.schema
  }

  /**
   * Get the editor's current `state`.
   *
   * @return {State}
   */

  getState = () => {
    return this.state.state
  }

  /**
   * When the editor receives a new 'state'
   *
   * @param {State} state
   * @return {State} newState
   */

  onBeforeChange = (state) => {
    if (state == this.state.state) return state

    for (const plugin of this.state.plugins) {
      if (!plugin.onBeforeChange) continue
      const newState = plugin.onBeforeChange(state, this)
      if (newState == null) continue
      state = newState
    }

    return state
  }

  /**
   * When the `state` changes, pass through plugins, then bubble up.
   *
   * @param {State} state
   */

  onChange = (state) => {
    if (state == this.state.state) return

    for (const plugin of this.state.plugins) {
      if (!plugin.onChange) continue
      const newState = plugin.onChange(state, this)
      if (newState == null) continue
      state = newState
    }

    this.props.onChange(state)

    if (state.document != this.tmp.document) {
      this.props.onDocumentChange(state.document, state)
      this.tmp.document = state.document
    }

    if (state.selection != this.tmp.selection) {
      this.props.onSelectionChange(state.selection, state)
      this.tmp.selection = state.selection
    }
  }

  /**
   * When an event by `name` fires, pass it through the plugins, and update the
   * state if one of them chooses to.
   *
   * @param {String} name
   * @param {Mixed} ...args
   */

  onEvent = (name, ...args) => {
    for (const plugin of this.state.plugins) {
      if (!plugin[name]) continue
      const newState = plugin[name](...args, this.state.state, this)
      if (!newState) continue
      this.onChange(newState)
      break
    }
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render = () => {
    debug('render')

    const handlers = {}

    for (const property of EVENT_HANDLERS) {
      handlers[property] = this[property]
    }

    return (
      <Content
        {...handlers}
        className={this.props.className}
        editor={this}
        onChange={this.onChange}
        readOnly={this.props.readOnly}
        schema={this.state.schema}
        spellCheck={this.props.spellCheck}
        state={this.state.state}
        style={this.props.style}
      />
    )
  }

  /**
   * Resolve the editor's current plugins from `props` when they change.
   *
   * Add a plugin made from the editor's own `props` at the beginning of the
   * stack. That way, you can add a `onKeyDown` handler to the editor itself,
   * and it will override all of the existing plugins.
   *
   * Also add the "core" functionality plugin that handles the most basic events
   * for the editor, like delete characters and such.
   *
   * @param {Object} props
   * @return {Array}
   */

  resolvePlugins = (props) => {
    const { onChange, plugins, ...editorPlugin } = props
    const corePlugin = CorePlugin(props)
    return [
      editorPlugin,
      ...plugins,
      corePlugin
    ]
  }

  /**
   * Resolve the editor's schema from a set of `plugins`.
   *
   * @param {Array} plugins
   * @return {Schema}
   */

  resolveSchema = (plugins) => {
    let rules = []

    for (const plugin of plugins) {
      if (!plugin.schema) continue
      const schema = Schema.create(plugin.schema)
      rules = rules.concat(schema.rules)
    }

    const schema = Schema.create({ rules })
    return schema
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
 */

export default Editor
