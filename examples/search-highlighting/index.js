import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'

/**
 * The rich text example.
 *
 * @type {Component}
 */

class SearchHighlighting extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On input change, update the decorations.
   *
   * @param {Event} event
   */

  onInputChange = event => {
    const { value } = this.state
    const string = event.target.value
    if (string === '') {
      const change = value
        .change()
        .setOperationFlag('save', false)
        .setValue({ decorations: [] })
        .setOperationFlag('save', true)
      this.onChange(change)
      return
    }
    const texts = value.document.getTexts()
    const decorations = []

    texts.forEach(node => {
      const { key, text } = node
      let offset = text.indexOf(string)
      for (
        offset = text.indexOf(string);
        offset !== -1;
        offset = text.indexOf(string, offset + string.length)
      ) {
        decorations.push({
          anchorKey: key,
          anchorOffset: offset,
          focusKey: key,
          focusOffset: offset + string.length,
          marks: [{ type: 'highlight' }],
        })
      }
    })

    // setting the `save` option to false prevents this change from being added
    // to the undo/redo stack and clearing the redo stack if the user has undone
    // changes.

    const change = value
      .change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true)
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
          value={this.state.value}
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

  renderMark = props => {
    const { children, mark, attributes } = props
    switch (mark.type) {
      case 'highlight':
        return (
          <span {...attributes} style={{ backgroundColor: '#ffeeba' }}>
            {children}
          </span>
        )
    }
  }
}

/**
 * Export.
 */

export default SearchHighlighting
