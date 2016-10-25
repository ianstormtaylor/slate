
import { Editor, Raw } from '../..'
import React from 'react'
import initialState from './state.json'

const EMOJIS = [
  '😃', '😬', '🍔'
]


/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    paragraph: props => <p>{props.children}</p>,
    emoji: (props) => {
      const { state, node } = props
      const { data } = node
      const code = data.get('code')
      const isSelected = state.selection.hasFocusIn(node)
      return <span className={`emoji ${isSelected ? 'selected' : ''}`} {...props.attributes} contentEditable={false}>{code}</span>
    }
  }
}

/**
 * The links example.
 *
 * @type {Component}
 */

class Emojis extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * When clicking a emoji, insert it
   *
   * @param {Event} e
   */

  onClickEmoji = (e, code) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .insertInline({
        type: 'emoji',
        isVoid: true,
        data: { code }
      })
      .apply()

    this.setState({ state })
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render = () => {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element} element
   */

  renderToolbar = () => {
    return (
      <div className="menu toolbar-menu">
        {EMOJIS.map((emoji, i) => {
          const onMouseDown = e => this.onClickEmoji(e, emoji)
          return (
            <span key={i} className="button" onMouseDown={onMouseDown}>
              <span className="material-icons">{emoji}</span>
            </span>
          )
        })}
      </div>
    )
  }

  /**
   * Render the editor.
   *
   * @return {Element} element
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default Emojis
