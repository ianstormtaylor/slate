import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'
import styled from 'react-emotion'
import { Icon, Toolbar } from '../components'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * Some styled components for the search box.
 *
 * @type {Component}
 */

const SearchWrapper = styled('div')`
  position: relative;
`

const SearchIcon = styled(Icon)`
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
   * The editor's schema.
   *
   * @type {Object}
   */

  schema = {
    marks: {
      highlight: {
        isAtomic: true,
      },
    },
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
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
          ref={this.ref}
          defaultValue={initialValue}
          schema={this.schema}
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

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'highlight':
        return (
          <span {...attributes} style={{ backgroundColor: '#ffeeba' }}>
            {children}
          </span>
        )
      default:
        return next()
    }
  }

  /**
   * On input change, update the decorations.
   *
   * @param {Event} event
   */

  onInputChange = event => {
    const { editor } = this
    const { value } = editor
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
            anchor: { key, offset: offset - string.length },
            focus: { key, offset },
            mark: { type: 'highlight' },
          })
        }

        offset = offset + part.length + string.length
      })
    })

    // Make the change to decorations without saving it into the undo history,
    // so that there isn't a confusing behavior when undoing.
    editor.withoutSaving(() => {
      editor.setDecorations(decorations)
    })
  }
}

/**
 * Export.
 */

export default SearchHighlighting
