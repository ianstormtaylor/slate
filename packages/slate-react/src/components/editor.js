
import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import logger from 'slate-dev-logger'
import { Schema, Stack, State } from 'slate'

import EVENT_HANDLERS from '../constants/event-handlers'
import PLUGINS_PROPS from '../constants/plugin-props'
import AfterPlugin from '../plugins/after'
import BeforePlugin from '../plugins/before'
import noop from '../utils/noop'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:editor')

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
    onChange: Types.func,
    placeholder: Types.any,
    placeholderClassName: Types.string,
    placeholderStyle: Types.object,
    plugins: Types.array,
    readOnly: Types.bool,
    role: Types.string,
    schema: Types.object,
    spellCheck: Types.bool,
    state: SlateTypes.state.isRequired,
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
    plugins: [],
    readOnly: false,
    schema: {},
    spellCheck: true,
  }

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.state = {}
    this.tmp = {}
    this.tmp.updates = 0
    this.tmp.resolves = 0

    // Resolve the plugins and create a stack and schema from them.
    const plugins = this.resolvePlugins(props.plugins, props.schema)
    const stack = Stack.create({ plugins })
    const schema = Schema.create({ plugins })
    this.state.schema = schema
    this.state.stack = stack

    // Run `onChange` on the passed-in state because we need to ensure that it
    // is normalized, and queue the resulting change.
    const change = props.state.change()
    stack.run('onChange', change, this)
    const { state } = change
    this.queueChange(change)
    this.cacheState(state)
    this.state.state = state

    // Create a bound event handler for each event.
    EVENT_HANDLERS.forEach((handler) => {
      this[handler] = (...args) => {
        this.onEvent(handler, ...args)
      }
    })

    if (props.onDocumentChange) {
      logger.deprecate('0.22.10', 'The `onDocumentChange` prop is deprecated because it led to confusing UX issues, see https://github.com/ianstormtaylor/slate/issues/614#issuecomment-327868679')
    }

    if (props.onSelectionChange) {
      logger.deprecate('0.22.10', 'The `onSelectionChange` prop is deprecated because it led to confusing UX issues, see https://github.com/ianstormtaylor/slate/issues/614#issuecomment-327868679')
    }
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary and run
   * `onChange` to ensure the state is normalized.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    let { state } = props
    let { schema, stack } = this.state

    // Increment the updates counter as a baseline.
    this.tmp.updates++

    // If the plugins or the schema have changed, we need to re-resolve the
    // plugins, since it will result in a new stack and new validations.
    if (props.plugins != this.props.plugins || props.schema != this.props.schema) {
      const plugins = this.resolvePlugins(props.plugins, props.schema)
      stack = Stack.create({ plugins })
      schema = Schema.create({ plugins })
      this.setState({ schema, stack })

      // Increment the resolves counter.
      this.tmp.resolves++

      // If we've resolved a few times already, and it's exactly in line with
      // the updates, then warn the user that they may be doing something wrong.
      if (this.tmp.resolves > 5 && this.tmp.resolves == this.tmp.updates) {
        logger.warn('A Slate <Editor> is re-resolving its `plugins` or `schema` on each update, which leads to poor performance. This is often due to passing in a new `schema` or `plugins` prop with each render, by declaring them inline in your render function. Do not do this!')
      }
    }

    // Run `onChange` on the passed-in state because we need to ensure that it
    // is normalized, and queue the resulting change.
    const change = state.change()
    stack.run('onChange', change, this)
    state = change.state
    this.queueChange(change)
    this.cacheState(state)
    this.setState({ state })
  }

  /**
   * When the component first mounts, flush any temporary changes.
   */

  componentDidMount = () => {
    this.flushChange()
  }

  /**
   * When the component updates, flush any temporary change.
   */

  componentDidUpdate = () => {
    this.flushChange()
  }

  /**
   * Cache a `state` object to be able to compare against it later.
   *
   * @param {State} state
   */

  cacheState = (state) => {
    this.tmp.document = state.document
    this.tmp.selection = state.selection
  }

  /**
   * Queue a `change` object, to be able to flush it later. This is required for
   * when a change needs to be applied to the state, but because of the React
   * lifecycle we can't apply that change immediately. So we cache it here and
   * later can call `this.flushChange()` to flush it.
   *
   * @param {Change} change
   */

  queueChange = (change) => {
    if (change.operations.length) {
      debug('queueChange', { change })
      this.tmp.change = change
    }
  }

  /**
   * Flush a temporarily stored `change` object, for when a change needed to be
   * made but couldn't because of React's lifecycle.
   */

  flushChange = () => {
    const { change } = this.tmp

    if (change) {
      debug('flushChange', { change })
      window.requestAnimationFrame(() => {
        delete this.tmp.change
        this.props.onChange(change)
      })
    }
  }

  /**
   * Programmatically blur the editor.
   */

  blur = () => {
    this.change(c => c.blur())
  }

  /**
   * Programmatically focus the editor.
   */

  focus = () => {
    this.change(c => c.focus())
  }

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  getSchema = () => {
    return this.state.schema
  }

  /**
   * Get the editor's current stack.
   *
   * @return {Stack}
   */

  getStack = () => {
    return this.state.stack
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
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    const { state } = this.state
    const change = state.change().call(...args)
    this.onChange(change)
  }

  /**
   * On event.
   *
   * @param {String} handler
   * @param {Event} event
   */

  onEvent = (handler, event) => {
    const { stack, state } = this.state
    const change = state.change()
    stack.run(handler, event, change, this)
    this.onChange(change)
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = (change) => {
    debug('onChange', { change })

    if (State.isState(change)) {
      throw new Error('As of slate@0.22.0 the `editor.onChange` method must be passed a `Change` object not a `State` object.')
    }

    const { stack } = this.state
    stack.run('onChange', change, this)
    const { state } = change
    const { document, selection } = this.tmp
    const { onChange, onDocumentChange, onSelectionChange } = this.props

    if (state == this.state.state) return
    onChange(change)
    if (onDocumentChange && state.document != document) onDocumentChange(state.document, change)
    if (onSelectionChange && state.selection != selection) onSelectionChange(state.selection, change)
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render() {
    debug('render', this)

    const { stack, state } = this.state
    const children = stack
      .map('renderPortal', state, this)
      .map((child, i) => <Portal key={i} isOpened>{child}</Portal>)

    const props = { ...this.props, children }
    const tree = stack.render('renderEditor', props, state, this)
    return tree
  }

  /**
   * Resolve an array of plugins from `plugins` and `schema` props.
   *
   * In addition to the plugins provided in props, this will initialize three
   * other plugins:
   *
   * - The top-level editor plugin, which allows for top-level handlers, etc.
   * - The two "core" plugins, one before all the other and one after.
   *
   * @param {Array|Void} plugins
   * @param {Schema|Object|Void} schema
   * @return {Array}
   */

  resolvePlugins = (plugins, schema) => {
    const beforePlugin = BeforePlugin()
    const afterPlugin = AfterPlugin()
    const editorPlugin = {
      schema: schema || {}
    }

    for (const prop of PLUGINS_PROPS) {
      // Skip `onChange` because the editor's `onChange` is special.
      if (prop == 'onChange') continue

      // Skip `schema` because it can't be proxied easily, so it must be
      // passed in as an argument to this function instead.
      if (prop == 'schema') continue

      // Define a function that will just proxies into `props`.
      editorPlugin[prop] = (...args) => {
        return this.props[prop] && this.props[prop](...args)
      }
    }

    return [
      beforePlugin,
      editorPlugin,
      ...(plugins || []),
      afterPlugin
    ]
  }

}


/**
 * Mix in the property types for the event handlers.
 */

for (const prop of EVENT_HANDLERS) {
  Editor.propTypes[prop] = Types.func
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
