
import Content from './content'
import React from 'react'
import State from '../models/state'
import corePlugin from '../plugins/core'

/**
 * Editor.
 */

class Editor extends React.Component {

  /**
   * Properties.
   */

  static propTypes = {
    onBeforeInput: React.PropTypes.func,
    onChange: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    plugins: React.PropTypes.array,
    renderDecorations: React.PropTypes.func,
    renderMark: React.PropTypes.func,
    renderNode: React.PropTypes.func,
    state: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    plugins: []
  };

  /**
   * When created, compute the plugins from `props`.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
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
    this.setState({ plugins: this.resolvePlugins(props) })
    this.setState({ state: this.resolveState(props.state) })
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
   * Render the editor.
   *
   * @return {Element} element
   */

  render = () => {
    return (
      <Content
        editor={this}
        state={this.state.state}
        onChange={this.onChange}
        renderMark={this.renderMark}
        renderNode={this.renderNode}
        onPaste={this.onPaste}
        onBeforeInput={this.onBeforeInput}
        onKeyDown={this.onKeyDown}
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
      throw new Error(`No renderer found for node with type "${node.type}".`)
    }
  }

  /**
   * Render a `mark`, cascading through the plugins.
   *
   * @param {Mark} mark
   * @return {Object} style
   */

  renderMark = (mark) => {
    for (const plugin of this.state.plugins) {
      if (!plugin.renderMark) continue
      const style = plugin.renderMark(mark, this.state.state, this)
      if (style) return style
      throw new Error(`No renderer found for mark with type "${mark.type}".`)
    }
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
    })

    state = state.merge({ document })
    return state
  }

}

/**
 * Export.
 */

export default Editor
