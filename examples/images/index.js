
import { Editor, Raw, Void } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import isImage from 'is-image'
import isUrl from 'is-url'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  image: (props) => {
    const { node, state } = props
    const src = node.data.get('src')
    return (
      <Void {...props} className="image-block">
        <img src={src} {...props.attributes} />
      </Void>
    )
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
          state={this.state.state}
          renderNode={this.renderNode}
          onChange={this.onChange}
          onDocumentChange={this.onDocumentChange}
          onDrop={this.onDrop}
          onPaste={this.onPaste}
        />
      </div>
    )
  }

  /**
   * Render a `node`.
   *
   * @param {Node} node
   * @return {Element}
   */

  renderNode = (node) => {
    return NODES[node.type]
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
        snapshot: false
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
   * @param {Object} drop
   * @param {State} state
   * @return {State}
   */

  onDrop = (e, drop, state) => {
    if (drop.type != 'node') return
    return state
      .transform()
      .removeNodeByKey(drop.node.key)
      .moveTo(drop.target)
      .insertBlock(drop.node)
      .apply()
  }

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} paste
   * @param {State} state
   * @return {State}
   */

  onPaste = (e, paste, state) => {
    if (paste.type != 'text') return
    if (!isUrl(paste.text)) return
    if (!isImage(paste.text)) return
    return this.insertImage(state, paste.text)
  }

  /**
   * Insert an image with `src` at the current selection.
   *
   * @param {State} state
   * @param {String} src
   * @return {State}
   */

  insertImage = (state, src) => {
    if (state.isExpanded) {
      state = state
        .transform()
        .delete()
        .apply()
    }

    const { anchorBlock, selection } = state
    let transform = state.transform()

    if (anchorBlock.type == 'image') {
      transform = transform.splitBlock()
    }

    else if (anchorBlock.text != '') {
      if (selection.isAtEndOf(anchorBlock)) {
        transform = transform.splitBlock()
      }

      else if (selection.isAtStartOf(anchorBlock)) {
        transform = transform
          .splitBlock()
          .collapseToStartOfPreviousBlock()
      }

      else {
        transform = transform
          .splitBlock()
          .splitBlock()
          .collapseToStartOfPreviousBlock()
      }
    }

    return transform
      .setBlock({
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
