import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import invariant from 'tiny-invariant'
import memoizeOne from 'memoize-one'
import warning from 'tiny-warning'
import { Editor as Controller } from 'slate'

import EVENT_HANDLERS from '../constants/event-handlers'
import ReactPlugin from '../plugins/react'

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
    options: Types.object,
    placeholder: Types.any,
    plugins: Types.array,
    readOnly: Types.bool,
    role: Types.string,
    schema: Types.object,
    spellCheck: Types.bool,
    style: Types.object,
    tabIndex: Types.number,
    value: SlateTypes.value.isRequired,
    ...EVENT_HANDLERS.reduce((obj, handler) => {
      obj[handler] = Types.func
      return obj
    }, {}),
  }

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    autoFocus: false,
    autoCorrect: true,
    onChange: () => {},
    options: {},
    placeholder: '',
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
    mounted: false,
    change: null,
    resolves: 0,
    updates: 0,
  }

  /**
   * When the component first mounts, flush a queued change if one exists.
   */

  componentDidMount() {
    this.tmp.mounted = true
    this.tmp.updates++

    if (this.props.autoFocus) {
      this.focus()
    }

    if (this.tmp.change) {
      this.props.onChange(this.tmp.change)
      this.tmp.change = null
    }
  }

  /**
   * When the component updates, flush a queued change if one exists.
   */

  componentDidUpdate() {
    this.tmp.updates++

    if (this.tmp.change) {
      this.props.onChange(this.tmp.change)
      this.tmp.change = null
    }
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  render() {
    debug('render', this)
    const props = { ...this.props, editor: this }

    // Re-resolve the controller if needed based on memoized props.
    const { commands, placeholder, plugins, queries, schema } = props
    this.resolveController(plugins, schema, commands, queries, placeholder)

    // Set the current props on the controller.
    const { options, readOnly, value } = props
    this.controller.setReadOnly(readOnly)
    this.controller.setValue(value, options)

    // Render the editor's children with the controller.
    const children = this.controller.run('renderEditor', props)
    return children
  }

  /**
   * Resolve an editor controller from the passed-in props. This method takes
   * all of the props as individual arguments to be able to properly memoize
   * against anything that could change and invalidate the old editor.
   *
   * @param {Array} plugins
   * @param {Object} schema
   * @param {Object} commands
   * @param {Object} queries
   * @param {String} placeholder
   * @return {Editor}
   */

  resolveController = memoizeOne(
    (plugins = [], schema, commands, queries, placeholder) => {
      // If we've resolved a few times already, and it's exactly in line with
      // the updates, then warn the user that they may be doing something wrong.
      warning(
        this.tmp.resolves < 5 || this.tmp.resolves !== this.tmp.updates,
        'A Slate <Editor> component is re-resolving the `plugins`, `schema`, `commands`, `queries` or `placeholder` prop on each update, which leads to poor performance. This is often due to passing in a new references for these props with each render by declaring them inline in your render function. Do not do this! Declare them outside your render function, or memoize them instead.'
      )

      this.tmp.resolves++
      const react = ReactPlugin(this.props)

      const onChange = change => {
        if (this.tmp.mounted) {
          this.props.onChange(change)
        } else {
          this.tmp.change = change
        }
      }

      this.controller = new Controller(
        { plugins: [react], onChange },
        { controller: this, construct: false }
      )

      this.controller.run('onConstruct')
    }
  )

  /**
   * Mimic the API of the `Editor` controller, so that this component instance
   * can be passed in its place to plugins.
   */

  get operations() {
    return this.controller.operations
  }

  get readOnly() {
    return this.controller.readOnly
  }

  get value() {
    return this.controller.value
  }

  applyOperation(...args) {
    return this.controller.applyOperation(...args)
  }

  command(...args) {
    return this.controller.command(...args)
  }

  normalize(...args) {
    return this.controller.normalize(...args)
  }

  query(...args) {
    return this.controller.query(...args)
  }

  registerCommand(...args) {
    return this.controller.registerCommand(...args)
  }

  registerQuery(...args) {
    return this.controller.registerQuery(...args)
  }

  run(...args) {
    return this.controller.run(...args)
  }

  withoutNormalizing(...args) {
    return this.controller.withoutNormalizing(...args)
  }

  /**
   * Deprecated.
   */

  get editor() {
    return this.controller.editor
  }

  get schema() {
    invariant(
      false,
      'As of Slate 0.42, the `editor.schema` property no longer exists, and its functionality has been folded into the editor itself. Use the `editor` instead.'
    )
  }

  get stack() {
    invariant(
      false,
      'As of Slate 0.42, the `editor.stack` property no longer exists, and its functionality has been folded into the editor itself. Use the `editor` instead.'
    )
  }

  call(...args) {
    return this.controller.call(...args)
  }

  change(...args) {
    return this.controller.change(...args)
  }

  onChange(...args) {
    return this.controller.onChange(...args)
  }

  applyOperations(...args) {
    return this.controller.applyOperations(...args)
  }

  setOperationFlag(...args) {
    return this.controller.setOperationFlag(...args)
  }

  getFlag(...args) {
    return this.controller.getFlag(...args)
  }

  unsetOperationFlag(...args) {
    return this.controller.unsetOperationFlag(...args)
  }

  withoutNormalization(...args) {
    return this.controller.withoutNormalization(...args)
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
