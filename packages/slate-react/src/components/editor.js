import Debug from 'debug'
import Portal from 'react-portal'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import logger from 'slate-dev-logger'
import { Schema, Stack } from 'slate'
import memoizeOne from 'memoize-one'

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
    plugins: Types.array,
    readOnly: Types.bool,
    role: Types.string,
    schema: Types.object,
    spellCheck: Types.bool,
    style: Types.object,
    tabIndex: Types.number,
    value: SlateTypes.value.isRequired,
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

  tmp = {
    updates: 0,
    resolves: 0,
    value: undefined,
    change: undefined,
  }

  state = {}

  /**
   * When the component first mounts, flush any temporary changes,
   * and then, focus the editor if `autoFocus` is set.
   */

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus()
    } else {
      this.onChange(this.tmp.change)
    }

    this.tmp.updates++
  }

  /**
   * When the component updates, flush any temporary change.
   */

  componentDidUpdate(prevProps) {
    // Increment the updates counter as a baseline.
    this.tmp.updates++

    // If we've resolved a few times already, and it's exactly in line with
    // the updates, then warn the user that they may be doing something wrong.
    if (this.tmp.resolves > 5 && this.tmp.resolves == this.tmp.updates) {
      logger.warn(
        'A Slate <Editor> is re-resolving `props.plugins` or `props.schema` on each update, which leads to poor performance. This is often due to passing in a new `schema` or `plugins` prop with each render by declaring them inline in your render function. Do not do this!'
      )
    }

    this.onChange(this.tmp.change)
  }

  /**
   * Get event handlers as passed by onEvent
   */

  handlers = EVENT_HANDLERS.reduce((obj, handler) => {
    obj[handler] = event => {
      this.onEvent(handler, event)
    }
    return obj
  }, {})

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    const { change } = this.tmp
    const lastOperationSize = change.operations.size
    change.call(...args)

    // Do not rerun the change if onChange is run already in resolveValue without more following operations
    if (change.operations.size > lastOperationSize) {
      debug('onChange', { change })
      this.stack.run('onChange', change, this)
    }

    this.onChange(change)
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = change => {
    debug('onChange', { change })

    if (this.tmp.change !== change) {
      this.stack.run('onChange', change, this)
    }

    const { value } = change
    if (value == this.props.value && change.operations.size === 0) return
    const { onChange } = this.props
    this.tmp.value = value
    this.tmp.stack = this.stack
    this.tmp.change = undefined
    onChange(change)
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
   * Getters for exposing public properties of the editor's state.
   */

  get schema() {
    const plugins = this.resolvePlugins(this.props.plugins, this.props.schema)
    return this.resolveSchema(plugins)
  }

  get stack() {
    const plugins = this.resolvePlugins(this.props.plugins, this.props.schema)
    return this.resolveStack(plugins)
  }

  get value() {
    // If value is obtained from the last lifecyle, which is already normalized with `onChange`;
    // do not run onChange again on it
    if (this.tmp.value === this.props.value && this.tmp.stack === this.stack) {
      const { value } = this.tmp
      this.tmp.change = value.change()
      return value
    }

    return this.resolveValue(this.props.value, this.stack)
  }

  /**
   * Get value after onChange stack, it is a memoized function and therefore do not need
   * to re-evaluate for the same value and stack.
   *
   * If the value is produced by onChange with the same stack, then will immediately return
   * this value.
   *
   * @param {Value} value
   * @param {Stack} stack
   * @return {Change}
   */

  resolveValue = memoizeOne((value, stack) => {
    const change = value.change()
    debug('onChange', { change })
    stack.run('onChange', change, this)
    this.tmp.change = change
    return change.value
  })

  /**
   * On event.
   *
   * @param {String} handler
   * @param {Event} event
   */

  onEvent = (handler, event) => {
    this.change(change => {
      this.stack.run(handler, event, change, this)
    })
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render() {
    debug('render', this)

    const children = this.stack
      .map('renderPortal', this.value, this)
      .map((child, i) => (
        <Portal key={i} isOpened>
          {child}
        </Portal>
      ))

    const props = { ...this.props, children }
    const tree = this.stack.render('renderEditor', props, this)
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

  resolvePlugins = memoizeOne((plugins, schema) => {
    this.tmp.resolves++
    const beforePlugin = BeforePlugin()
    const afterPlugin = AfterPlugin()
    const editorPlugin = {
      schema: schema || {},
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

    return [beforePlugin, editorPlugin, ...(plugins || []), afterPlugin]
  })

  /**
   * Get stack by plugins, it is a memoized function and therefore do not need
   * to re-evaluate for the same plugins
   *
   * @param {Array<Object>} plugins
   * @return {Stack}
   */

  resolveStack = memoizeOne(plugins => Stack.create({ plugins }))

  /**
   * Get schema by plugins, it is a memoized function and therefore do not need
   * to re-evaluate for the same plugins
   *
   * @param {Array<Object>} plugins
   * @return {Schema}
   */

  resolveSchema = memoizeOne(plugins => Schema.create({ plugins }))
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
