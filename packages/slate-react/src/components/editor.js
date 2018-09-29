import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import warning from 'slate-dev-warning'
import { Editor as Controller } from 'slate'
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
    onChange: noop,
    options: {},
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
    const { plugins, schema, value, options } = props
    this.state = {}
    this.resolvePlugins = memoizeOne(this.resolvePlugins)

    this.tmp = {
      mounted: false,
      change: null,
      resolves: 0,
      updates: 0,
    }

    this.controller = new Controller(
      {
        value,
        plugins: this.resolvePlugins(plugins, schema),
        onChange: change => {
          if (this.tmp.mounted) {
            this.props.onChange(change)
          } else {
            this.tmp.change = change
          }
        },
      },
      options
    )
  }

  /**
   * When the component first mounts, focus the editor if `autoFocus` is set,
   * and then flush a queued change if one exists.
   */

  componentDidMount() {
    this.tmp.mounted = true
    this.tmp.updates++

    if (this.props.autoFocus) {
      this.controller.change(c => c.focus())
    }

    if (this.tmp.change) {
      this.props.onChange(this.tmp.change)
      this.tmp.change = null
    }
  }

  /**
   * When the component updates, ensure that it's not re-resolving often, and
   * then flush a queued change if one exists.
   */

  componentDidUpdate(prevProps) {
    this.tmp.updates++

    // If we've resolved a few times already, and it's exactly in line with
    // the updates, then warn the user that they may be doing something wrong.
    warning(
      this.tmp.resolves < 5 || this.tmp.resolves !== this.tmp.updates,
      'A Slate <Editor> component is re-resolving `props.plugins` or `props.schema` on each update, which leads to poor performance. This is often due to passing in a new `schema` or `plugins` prop with each render by declaring them inline in your render function. Do not do this!'
    )

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
    const { controller, tmp } = this
    const props = { ...this.props }
    const { plugins, schema, value, readOnly, options } = props

    controller.setProperties(
      {
        plugins: this.resolvePlugins(plugins, schema),
        value: tmp.change ? tmp.change.value : value,
        readOnly,
      },
      options
    )

    const tree = controller.runRender('renderEditor', props, this)
    return tree
  }

  /**
   * Resolve a set of plugins from potential `plugins` and a `schema`.
   *
   * In addition to the plugins provided in props, this will initialize three
   * other plugins:
   *
   * - The top-level editor plugin, which allows for top-level handlers, etc.
   * - The two "core" plugins, one before all the other and one after.
   *
   * @param {Array} plugins
   * @param {Schema|Object} schema
   * @return {Array}
   */

  resolvePlugins = (plugins = [], schema = {}) => {
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
  }

  /**
   * Mimic the API of the `Editor` controller, so that this component instance
   * can be passed in its place to plugins.
   */

  get onChange() {
    return this.controller.onChange
  }

  get plugins() {
    return this.controller.plugins
  }

  get readOnly() {
    return this.controller.readOnly
  }

  get schema() {
    return this.controller.schema
  }

  get value() {
    return this.controller.value
  }

  change = (...args) => {
    this.controller.change(change => {
      change.editor = this
      change.call(...args)
    })
  }

  event = (handler, event) => {
    this.change(change => {
      this.run(handler, event, change)
    })
  }

  run = (...args) => {
    return this.controller.run(...args)
  }

  runFind = (...args) => {
    return this.controller.runFind(...args)
  }

  runMap = (...args) => {
    return this.controller.runMap(...args)
  }

  runRender = (...args) => {
    return this.controller.runRender(...args)
  }

  /**
   * Mimic the API of a DOM input/textarea, to maintain a React-like interface.
   */

  blur = () => {
    this.controller.change(c => c.blur())
  }

  focus = () => {
    this.controller.change(c => c.focus())
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Editor
