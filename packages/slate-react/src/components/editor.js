import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import warning from 'slate-dev-warning'
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
   * Initial state.
   *
   * @type {Object}
   */

  state = {}

  /**
   * Temporary values.
   *
   * @type {Object}
   */

  tmp = {
    change: null,
    isChanging: false,
    operationsSize: null,
    plugins: null,
    resolves: 0,
    updates: 0,
    value: null,
  }

  /**
   * Create a set of bound event handlers.
   *
   * @type {Object}
   */

  handlers = EVENT_HANDLERS.reduce((obj, handler) => {
    obj[handler] = event => this.onEvent(handler, event)
    return obj
  }, {})

  /**
   * When the component first mounts, flush any temporary changes, and then,
   * focus the editor if `autoFocus` is set.
   */

  componentDidMount() {
    this.tmp.updates++

    const { autoFocus } = this.props
    const { change } = this.tmp

    if (autoFocus) {
      if (change) {
        change.focus()
      } else {
        this.focus()
      }
    }

    if (change) {
      this.onChange(change)
    }
  }

  /**
   * When the component updates, flush any temporary change.
   */

  componentDidUpdate(prevProps) {
    this.tmp.updates++

    const { change, resolves, updates } = this.tmp

    // If we've resolved a few times already, and it's exactly in line with
    // the updates, then warn the user that they may be doing something wrong.
    warning(
      resolves < 5 || resolves !== updates,
      'A Slate <Editor> component is re-resolving `props.plugins` or `props.schema` on each update, which leads to poor performance. This is often due to passing in a new `schema` or `plugins` prop with each render by declaring them inline in your render function. Do not do this!'
    )

    if (change) {
      this.onChange(change)
    }
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render() {
    debug('render', this)
    const props = { ...this.props }
    const tree = this.stack.render('renderEditor', props, this)
    return tree
  }

  /**
   * Get the editor's current plugins.
   *
   * @return {Array}
   */

  get plugins() {
    const plugins = this.resolvePlugins(this.props.plugins, this.props.schema)
    return plugins
  }

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  get schema() {
    const schema = this.resolveSchema(this.plugins)
    return schema
  }

  /**
   * Get the editor's current stack.
   *
   * @return {Stack}
   */

  get stack() {
    const stack = this.resolveStack(this.plugins)
    return stack
  }

  /**
   * Get the editor's current value.
   *
   * @return {Value}
   */

  get value() {
    // If the current `plugins` and `value` are the same as the last seen ones
    // that were saved in `tmp`, don't re-resolve because that will trigger
    // extra `onChange` runs.
    if (
      this.plugins === this.tmp.plugins &&
      this.props.value === this.tmp.value
    ) {
      return this.tmp.value
    }

    const value = this.resolveValue(this.plugins, this.props.value)
    return value
  }

  /**
   * Perform a change on the editor, passing `...args` to `change.call`.
   *
   * @param {Mixed} ...args
   */

  change = (...args) => {
    if (this.tmp.isChanging) {
      warning(
        false,
        "The `editor.change` method was called from within an existing `editor.change` callback. This is not allowed, and often due to calling `editor.change` directly from a plugin's event handler which is unnecessary."
      )

      return
    }

    const change = this.value.change()

    try {
      this.tmp.isChanging = true
      change.call(...args)
    } catch (error) {
      throw error
    } finally {
      this.tmp.isChanging = false
    }

    this.onChange(change)
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
   * On change.
   *
   * @param {Change} change
   */

  onChange = change => {
    // If the change doesn't define any operations to apply, abort.
    if (change.operations.size === 0) {
      return
    }

    debug('onChange', { change })
    change = this.resolveChange(this.plugins, change, change.operations.size)

    // Store a reference to the last `value` and `plugins` that were seen by the
    // editor, so we can know whether to normalize a new unknown value if one
    // is passed in via `this.props`.
    this.tmp.value = change.value
    this.tmp.plugins = this.plugins

    // Remove the temporary `change`, since it's being flushed.
    delete this.tmp.change
    delete this.tmp.operationsSize

    this.props.onChange(change)
  }

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
   * Resolve a change from the current `plugins`, a potential `change` and its
   * current operations `size`.
   *
   * @param {Array} plugins
   * @param {Change} change
   * @param {Number} size
   */

  resolveChange = memoizeOne((plugins, change, size) => {
    const stack = this.resolveStack(plugins)
    stack.run('onChange', change, this)
    return change
  })

  /**
   * Resolve a set of plugins from potential `plugins` and a `schema`.
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

  resolvePlugins = memoizeOne((plugins = [], schema = {}) => {
    debug('resolvePlugins', { plugins, schema })
    this.tmp.resolves++

    const beforePlugin = BeforePlugin()
    const afterPlugin = AfterPlugin()
    const editorPlugin = { schema }

    for (const prop of PLUGINS_PROPS) {
      // Skip `onChange` because the editor's `onChange` is special.
      if (prop == 'onChange') continue

      // Skip `schema` because it can't be proxied easily, so it must be passed
      // in as an argument to this function instead.
      if (prop == 'schema') continue

      // Define a function that will just proxies into `props`.
      editorPlugin[prop] = (...args) => {
        return this.props[prop] && this.props[prop](...args)
      }
    }

    return [beforePlugin, editorPlugin, ...plugins, afterPlugin]
  })

  /**
   * Resolve a schema from the current `plugins`.
   *
   * @param {Array} plugins
   * @return {Schema}
   */

  resolveSchema = memoizeOne(plugins => {
    debug('resolveSchema', { plugins })
    const schema = Schema.create({ plugins })
    return schema
  })

  /**
   * Resolve a stack from the current `plugins`.
   *
   * @param {Array} plugins
   * @return {Stack}
   */

  resolveStack = memoizeOne(plugins => {
    debug('resolveStack', { plugins })
    const stack = Stack.create({ plugins })
    return stack
  })

  /**
   * Resolve a value from the current `plugins` and a potential `value`.
   *
   * @param {Array} plugins
   * @param {Value} value
   * @return {Change}
   */

  resolveValue = memoizeOne((plugins, value) => {
    debug('resolveValue', { plugins, value })
    let change = value.change()
    change = this.resolveChange(plugins, change, change.operations.size)

    // Store the change and it's operations count so that it can be flushed once
    // the component next updates.
    this.tmp.change = change
    this.tmp.operationsSize = change.operations.size

    return change.value
  })
}

/**
 * Mix in the prop types for the event handlers.
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
