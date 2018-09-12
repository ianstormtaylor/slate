import { Editor } from '@gitbook/slate-react'
import { Value } from '@gitbook/slate'

import React from 'react'
import initialValue from './value.json'
import styled from 'react-emotion'
import { Toolbar } from '../components'

/**
 * Some styled components for the search box.
 *
 * @type {Component}
 */

const SearchWrapper = styled('div')`
  position: relative;
`

const SearchIcon = styled('icon')`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  color: #ccc;
`

const SearchInput = styled('input')`
  padding-left: 2em;
  width: 100%;
`

/**
 * The search highlighting example.
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
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Toolbar>
          <SearchWrapper>
            <SearchIcon>search</SearchIcon>
            <SearchInput
              type="search"
              placeholder="Search the text..."
              onChange={this.onInputChange}
            />
          </SearchWrapper>
        </Toolbar>
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
    const texts = value.document.getTexts()
    const decorations = []

    texts.forEach(node => {
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
            atomic: true,
          })
        }

        offset = offset + part.length + string.length
      })
    })

    // Setting the `save` option to false prevents this change from being added
    // to the undo/redo stack and clearing the redo stack if the user has undone
    // changes.
    const change = value
      .change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true)

    this.onChange(change)
  }
}

/**
 * Export.
 */

export default SearchHighlighting
