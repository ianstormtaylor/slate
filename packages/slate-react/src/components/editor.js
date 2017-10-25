
import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import logger from 'slate-dev-logger'
import { Schema, Stack, State } from 'slate'

import EVENT_HANDLERS from '../constants/event-handlers'
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

    // Create a new `Stack`, omitting the `onChange` property since that has
    // special significance on the editor itself.
    const plugins = resolvePlugins(props)
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
    let isNew = false

    // Check to see if any plugin-related properœties have changed.
    for (let i = 0; i < PLUGINS_PROPS.length; i++) {
      const prop = PLUGINS_PROPS[i]
      if (props[prop] == this.props[prop]) continue
      isNew = true
      break
    }

    // If any plugin-related properties will change, create a new `Stack`.
    if (isNew) {
      const plugins = resolvePlugins(props)
      stack = Stack.create({ plugins })
      schema = Schema.create({ plugins })
      this.setState({ schema, stack })
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

}

/**
 * Resolve an array of plugins from `props`.
 *
 * In addition to the plugins provided in `props.plugins`, this will create
 * two other plugins:
 *
 * - A plugin made from the top-level `props` themselves, which are placed at
 * the beginning of the stack. That way, you can add a `onKeyDown` handler,
 * and it will override all of the existing plugins.
 *
 * - A "core" functionality plugin that handles the most basic events in
 * Slate, like deleting characters, splitting blocks, etc.
 *
 * @param {Object} props
 * @return {Array}
 */

function resolvePlugins(props) {
  // eslint-disable-next-line no-unused-vars
  const { state, onChange, plugins = [], ...overridePlugin } = props
  const beforePlugin = BeforePlugin(props)
  const afterPlugin = AfterPlugin(props)
  return [
    beforePlugin,
    overridePlugin,
    ...plugins,
    afterPlugin
  ]
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
