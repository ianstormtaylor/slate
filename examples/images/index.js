
import { Editor, Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import isImage from 'is-image'
import isUrl from 'is-url'
import { Map } from 'immutable'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  image: (props) => {
    const { node, state } = props
    const { data } = node
    const isActive = state.isFocused && state.blocks.includes(node)
    const src = data.get('src')
    return <img {...props.attributes} src={src} data-active={isActive} />
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
    state: Raw.deserialize(initialState)
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
