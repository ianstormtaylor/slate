
import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import logger from 'slate-dev-logger'
import { Stack, State } from 'slate'

import CorePlugin from '../plugins/core'
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
  'onKeyUp',
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
    const { state } = props
    const plugins = resolvePlugins(props)
    const stack = Stack.create({ plugins })
    this.state.stack = stack

    // Cache and set the state.
    this.cacheState(state)
    this.state.state = state

    // Create a bound event handler for each event.
    for (let i = 0; i < EVENT_HANDLERS.length; i++) {
      const method = EVENT_HANDLERS[i]
      this[method] = (...args) => {
        const stk = this.state.stack
        const change = this.state.state.change()
        stk[method](change, this, ...args)
        stk.onBeforeChange(change, this)
        stk.onChange(change, this)
        this.onChange(change)
      }
    }

    if (props.onDocumentChange) {
      logger.deprecate('0.22.10', 'The `onDocumentChange` prop is deprecated because it led to confusing UX issues, see https://github.com/ianstormtaylor/slate/issues/614#issuecomment-327868679')
    }

    if (props.onSelectionChange) {
      logger.deprecate('0.22.10', 'The `onSelectionChange` prop is deprecated because it led to confusing UX issues, see https://github.com/ianstormtaylor/slate/issues/614#issuecomment-327868679')
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
    for (let i = 0; i < PLUGINS_PROPS.length; i++) {
      const prop = PLUGINS_PROPS[i]
      if (props[prop] == this.props[prop]) continue
      const plugins = resolvePlugins(props)
      const stack = Stack.create({ plugins })
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
    this.change(t => t.blur())
  }

  /**
   * Programmatically focus the editor.
   */

  focus = () => {
    this.change(t => t.focus())
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
   * Perform a change `fn` on the editor's current state.
   *
   * @param {Function} fn
   */

  change = (fn) => {
    const change = this.state.state.change()
    fn(change)
    this.onChange(change)
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = (change) => {
    if (State.isState(change)) {
      throw new Error('As of slate@0.22.0 the `editor.onChange` method must be passed a `Change` object not a `State` object.')
    }

    const { onChange, onDocumentChange, onSelectionChange } = this.props
    const { document, selection } = this.tmp
    const { state } = change
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
  const corePlugin = CorePlugin(props)
  return [
    overridePlugin,
    ...plugins,
    corePlugin
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
