import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'
import { css } from 'emotion'
import { Icon, Toolbar } from '../components'

/**
 * Get a unique key for the search highlight annotations.
 *
 * @return {String}
 */

let n = 0

function getHighlightKey() {
  return `highlight_${n++}`
}

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

const SearchWrapper = props => (
  <div
    {...props}
    className={css`
      position: relative;
    `}
  />
)

const SearchIcon = props => (
  <Icon
    {...props}
    className={css`
      position: absolute;
      top: 0.5em;
      left: 0.5em;
      color: #ccc;
    `}
  />
)

const SearchInput = props => (
  <input
    {...props}
    className={css`
      padding-left: 2em;
      width: 100%;
    `}
  />
)

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
    annotations: {
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

  ref = React.createRef()

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
          renderAnnotation={this.renderAnnotation}
          renderMark={this.renderMark}
          spellCheck
        />
      </div>
    )
  }

  /**
   * Render a Slate annotation.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderAnnotation = (props, editor, next) => {
    const { children, annotation, attributes } = props

    switch (annotation.type) {
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
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      default:
        return next()
    }
  }

  /**
   * On input change, update the annotations.
   *
   * @param {Event} event
   */

  onInputChange = event => {
    const editor = this.ref.current
    const { value } = editor
    const { document, annotations } = value
    const string = event.target.value

    // Make the change to annotations without saving it into the undo history,
    // so that there isn't a confusing behavior when undoing.
    editor.withoutSaving(() => {
      annotations.forEach(ann => {
        if (ann.type === 'highlight') {
          editor.removeAnnotation(ann)
        }
      })

      for (const [node, path] of document.texts()) {
        const { key, text } = node
        const parts = text.split(string)
        let offset = 0

        parts.forEach((part, i) => {
          if (i !== 0) {
            editor.addAnnotation({
              key: getHighlightKey(),
              type: 'highlight',
              anchor: { path, key, offset: offset - string.length },
              focus: { path, key, offset },
            })
          }

          offset = offset + part.length + string.length
        })
      }
    })
  }
}

/**
 * Export.
 */

export default SearchHighlighting
