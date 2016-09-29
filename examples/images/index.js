
import { Editor, Raw, Void } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import isImage from 'is-image'
import isUrl from 'is-url'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    image: (props) => {
      const { node, state } = props
      const isFocused = state.selection.hasEdgeIn(node)
      const src = node.data.get('src')
      const className = isFocused ? 'active' : null
      return (
        <img src={src} className={className} {...props.attributes} />
      )
    }
  }
}

/**
 * The images example.
 *
 * @type {Component}
 */

class Images extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

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
        <span className="button" onMouseDown={this.onClickImage}>
          <span className="material-icons">image</span>
        </span>
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
          onDocumentChange={this.onDocumentChange}
          onDrop={this.onDrop}
          onPaste={this.onPaste}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On document change, if the last block is an image, add another paragraph.
   *
   * @param {Document} document
   * @param {State} state
   */

  onDocumentChange = (document, state) => {
    const blocks = document.getBlocks()
    const last = blocks.last()
    if (last.type != 'image') return

    const normalized = state
      .transform()
      .collapseToEndOf(last)
      .splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {}
      })
      .apply({
        save: false
      })

    this.onChange(normalized)
  }

  /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} e
   */

  onClickImage = (e) => {
    e.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    let { state } = this.state
    state = this.insertImage(state, src)
    this.onChange(state)
  }

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onDrop = (e, data, state, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'node': return this.onDropNode(e, data, state)
    }
  }

  /**
   * On drop node, insert the node wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onDropNode = (e, data, state) => {
    return state
      .transform()
      .unsetSelection()
      .removeNodeByKey(data.node.key)
      .moveTo(data.target)
      .insertBlock(data.node)
      .apply()
  }

  /**
   * On drop or paste files, read and insert the image files.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onDropOrPasteFiles = (e, data, state, editor) => {
    for (const file of data.files) {
      const reader = new FileReader()
      const [ type, ext ] = file.type.split('/')
      if (type != 'image') continue

      reader.addEventListener('load', () => {
        state = editor.getState()
        state = this.insertImage(state, reader.result)
        editor.onChange(state)
      })

      reader.readAsDataURL(file)
    }
  }

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onPaste = (e, data, state, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'text': return this.onPasteText(e, data, state)
    }
  }

  /**
   * On paste text, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onPasteText = (e, data, state) => {
    if (!isUrl(data.text)) return
    if (!isImage(data.text)) return
    return this.insertImage(state, data.text)
  }

  /**
   * Insert an image with `src` at the current selection.
   *
   * @param {State} state
   * @param {String} src
   * @return {State}
   */

  insertImage = (state, src) => {
    return state
      .transform()
      .insertBlock({
        type: 'image',
        isVoid: true,
        data: { src }
      })
      .apply()
  }

}

/**
 * Export.
 */

export default Images
