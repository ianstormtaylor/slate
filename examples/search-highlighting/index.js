
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * The rich text example.
 *
 * @type {Component}
 */

class SearchHighlighting extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState),
  }

  /**
   * On change, save the new `state`.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * On input change, update the decorations.
   *
   * @param {Event} event
   */

  onInputChange = (event) => {
    const { state } = this.state
    const string = event.target.value
    const texts = state.document.getTexts()
    const decorations = []

    texts.forEach((node) => {
      const { key, text } = node
      const parts = text.split(string)
      let offset = 0

      parts.forEach((part, i) => {
        if (i != 0) {
          decorations.push({
            anchorKey: key,
            anchorOffset: offset - string.length,
            focusKey: key,
            focusOffset: offset,
            marks: [{ type: 'highlight' }],
          })
        }

        offset = offset + part.length + string.length
      })
    })

    const change = state.change().setState({ decorations })
    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
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
   * @return {Element}
   */

  renderToolbar = () => {
    return (
      <div className="menu toolbar-menu">
        <div className="search">
          <span className="search-icon material-icons">search</span>
          <input
            className="search-box"
            type="search"
            placeholder="Search the text..."
            onChange={this.onInputChange}
          />
        </div>
      </div>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some rich text..."
          state={this.state.state}
          onChange={this.onChange}
          renderMark={this.renderMark}
          spellCheck
        />
      </div>
    )
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'highlight': return <span style={{ backgroundColor: '#ffeeba' }}>{children}</span>
    }
  }

}

/**
 * Export.
 */

export default SearchHighlighting
