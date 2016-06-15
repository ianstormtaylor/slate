
import Content from './content'
import React from 'react'
import CORE_PLUGIN from '../plugins/core'

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
    state: {}
  };

  constructor(props) {
    super(props)
    this.state = {
      plugins: this.resolvePlugins(props),
      state: props.state
    }
  }

  componentWillReceiveProps(props) {
    const plugins = this.resolvePlugins(props)
    this.setState({ plugins })
  }

  onChange(state) {
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
    return this.state.state
  }

  /**
   * Handle the `keydown` event.
   *
   * @param {Event} e
   */

  onKeyDown(e) {
    for (const plugin of this.state.plugins) {
      if (plugin.onKeyDown) {
        const newState = plugin.onKeyDown(e, this)
        if (newState == null) continue
        this.props.onChange(newState)
        break
      }
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
        onKeyDown={e => this.onKeyDown(e)}
      />
    )
  }

  resolvePlugins(props) {
    return [
      ...props.plugins,
      CORE_PLUGIN
    ]
  }

}

/**
 * Export.
 */

export default Editor
