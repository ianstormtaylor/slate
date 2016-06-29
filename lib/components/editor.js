
import Content from './content'
import React from 'react'
import State from '../models/state'
import corePlugin from '../plugins/core'

/**
 * Editor.
 */

class Editor extends React.Component {

  static propTypes = {
    plugins: React.PropTypes.array,
    renderMark: React.PropTypes.func,
    renderNode: React.PropTypes.func,
    state: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    plugins: [],
    state: new State()
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
  }

  /**
   * When the `props` are updated, recompute the plugins.
   *
   * @param {Object} props
   */

  componentWillReceiveProps(props) {
    const plugins = this.resolvePlugins(props)
    this.setState({ plugins })
  }

  /**
   * Get the editor's current `state`.
   *
   * @return {State} state
   */

  getState() {
    return this.props.state
  }

  /**
   * When the `state` changes, pass through plugins, then bubble up.
   *
   * @param {State} state
   */

  onChange(state) {
    if (state == this.props.state) return

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

  onEvent(name, ...args) {
    for (const plugin of this.state.plugins) {
      if (!plugin[name]) continue
      const newState = plugin[name](...args, this.props.state, this)
      if (!newState) continue
      this.props.onChange(newState)
      break
    }
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Content
        state={this.props.state}
        onChange={state => this.onChange(state)}
        renderMark={mark => this.renderMark(mark)}
        renderNode={node => this.renderNode(node)}
        onPaste={(e, paste) => this.onEvent('onPaste', e, paste)}
        onBeforeInput={e => this.onEvent('onBeforeInput', e)}
        onKeyDown={e => this.onEvent('onKeyDown', e)}
      />
    )
  }

  /**
   * Render a `node`, cascading through the plugins.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderNode(node) {
    for (const plugin of this.state.plugins) {
      if (!plugin.renderNode) continue
      const component = plugin.renderNode(node, this.props.state, this)
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

  renderMark(mark) {
    for (const plugin of this.state.plugins) {
      if (!plugin.renderMark) continue
      const style = plugin.renderMark(mark, this.props.state, this)
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

  resolvePlugins(props) {
    const { onChange, plugins, ...editorPlugin } = props
    return [
      editorPlugin,
      ...plugins,
      corePlugin
    ]
  }

}

/**
 * Export.
 */

export default Editor
