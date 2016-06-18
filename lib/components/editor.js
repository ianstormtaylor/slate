
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
   * Get the editor's current `state`.
   *
   * @return {State} state
   */

  getState() {
    return this.props.state
  }

  /**
   * When an event by `name` fires, pass it through the plugins, and update the
   * state if one of them chooses to.
   *
   * @param {String} name
   * @param {Event} e
   */

  onEvent(name, e) {
    for (const plugin of this.state.plugins) {
      if (!plugin[name]) continue
      const newState = plugin[name](e, this.props.state, this)
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
        renderMark={this.props.renderMark}
        renderNode={this.props.renderNode}
        state={this.props.state}
        onChange={state => this.onChange(state)}
        onKeyDown={e => this.onEvent('onKeyDown', e)}
      />
    )
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
