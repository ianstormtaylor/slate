
import Content from './content'
import CorePlugin from '../plugins/core'
import React from 'react'
import State from '../models/state'

/**
 * Noop.
 */

function noop() {}

/**
 * Editor.
 */

class Editor extends React.Component {

  /**
   * Properties.
   */

  static propTypes = {
    className: React.PropTypes.string,
    onBeforeInput: React.PropTypes.func,
    onChange: React.PropTypes.func.isRequired,
    onDocumentChange: React.PropTypes.func,
    onDrop: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onSelectionChange: React.PropTypes.func,
    placeholder: React.PropTypes.any,
    placeholderClassName: React.PropTypes.string,
    placeholderStyle: React.PropTypes.object,
    plugins: React.PropTypes.array,
    readOnly: React.PropTypes.bool,
    renderDecorations: React.PropTypes.func,
    renderMark: React.PropTypes.func,
    renderNode: React.PropTypes.func,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  static defaultProps = {
    onDocumentChange: noop,
    onSelectionChange: noop,
    plugins: [],
    readOnly: false
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
    this.state.state = this.resolveState(props.state)
  }

  /**
   * When the `props` are updated, recompute the plugins.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    if (props.plugins != this.props.plugins) {
      this.setState({ plugins: this.resolvePlugins(props) })
    }

    if (props.state != this.props.state) {
      this.setState({ state: this.resolveState(props.state) })
    }
  }

  /**
   * Blur the editor.
   */

  blur = () => {
    const state = this.state.state
      .transform()
      .blur()
      .apply()

    this.onChange(state)
  }

  /**
   * Focus the editor.
   */

  focus = () => {
    const state = this.state.state
      .transform()
      .focus()
      .apply()

    this.onChange(state)
  }

  /**
   * Get the editor's current `state`.
   *
   * @return {State} state
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
   * On before input.
   *
   * @param {Mixed} ...args
   */

  onBeforeInput = (...args) => {
    this.onEvent('onBeforeInput', ...args)
  }

  /**
   * On drop.
   *
   * @param {Mixed} ...args
   */

  onDrop = (...args) => {
    this.onEvent('onDrop', ...args)
  }

  /**
   * On key down.
   *
   * @param {Mixed} ...args
   */

  onKeyDown = (...args) => {
    this.onEvent('onKeyDown', ...args)
  }

  /**
   * On paste.
   *
   * @param {Mixed} ...args
   */

  onPaste = (...args) => {
    this.onEvent('onPaste', ...args)
  }

  /**
   * On selection.
   *
   * @param {Mixed} ...args
   */

  onSelect = (...args) => {
    this.onEvent('onSelect', ...args)
  }

  /**
   * Render the editor.
   *
   * @return {Element} element
   */

  render = () => {
    return (
      <Content
        className={this.props.className}
        editor={this}
        onBeforeInput={this.onBeforeInput}
        onChange={this.onChange}
        onDrop={this.onDrop}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
        onSelect={this.onSelect}
        readOnly={this.props.readOnly}
        renderMark={this.renderMark}
        renderNode={this.renderNode}
        state={this.state.state}
        style={this.props.style}
      />
    )
  }

  /**
   * Render a `node`, cascading through the plugins.
   *
   * @param {Node} node
   * @return {Element} element
   */

  renderNode = (node) => {
    for (const plugin of this.state.plugins) {
      if (!plugin.renderNode) continue
      const component = plugin.renderNode(node, this.state.state, this)
      if (component) return component
    }
  }

  /**
   * Render a `mark`, cascading through the plugins.
   *
   * @param {Mark} mark
   * @param {Set} marks
   * @return {Object} style
   */

  renderMark = (mark, marks) => {
    for (const plugin of this.state.plugins) {
      if (!plugin.renderMark) continue
      const style = plugin.renderMark(mark, marks, this.state.state, this)
      if (style) return style
    }

    return {}
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
   * @return {Array} plugins
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
   * Resolve the editor's current state from `props` when they change.
   *
   * This is where we handle decorating the text nodes with the decorator
   * functions, so that they are always accounted for when rendering.
   *
   * @param {State} state
   * @return {State} state
   */

  resolveState = (state) => {
    const { plugins } = this.state
    let { document } = state

    document = document.decorateTexts((text) => {
      for (const plugin of plugins) {
        if (!plugin.renderDecorations) continue
        const characters = plugin.renderDecorations(text, state, this)
        if (characters) return characters
      }

      return text.characters
    })

    state = state.merge({ document })
    return state
  }

}

/**
 * Export.
 */

export default Editor
