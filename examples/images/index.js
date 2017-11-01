
import { Editor, getEventRange, getEventTransfer } from 'slate-react'
import { Block, Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import isImage from 'is-image'
import isUrl from 'is-url'

/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Range} target
 */

function insertImage(change, src, target) {
  if (target) {
    change.select(target)
  }

  change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src }
  })
}

/**
 * The images example.
 *
 * @type {Component}
 */

class Images extends React.Component {

  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue)
  }

  /**
   * Render the app.
   *
   * @return {Element} element
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
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          onDrop={this.onDrop}
          onPaste={this.onPaste}
          renderNode={this.renderNode}
          validateNode={this.validateNode}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    const { attributes, node, isSelected } = props
    switch (node.type) {
      case 'image': {
        const src = node.data.get('src')
        const className = isSelected ? 'active' : null
        const style = { display: 'block' }
        return (
          <img src={src} className={className} style={style} {...attributes} />
        )
      }
    }
  }

  /**
   * Perform node validation on the document.
   *
   * @param {Node} node
   * @return {Function|Void}
   */

  validateNode = (node) => {
    if (node.kind != 'document') return
    const last = node.nodes.last()

    if (!last || last.type != 'paragraph') {
      const index = node.nodes.size
      const paragraph = Block.create('paragraph')
      return change => change.insertNodeByKey(node.key, index, paragraph)
    }
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} event
   */

  onClickImage = (event) => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return

    const change = this.state.value
      .change()
      .call(insertImage, src)

    this.onChange(change)
  }

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  onDropOrPaste = (event, change, editor) => {
    const target = getEventRange(event)
    if (!target) return

    const transfer = getEventTransfer(event)
    const { type, text, files } = transfer

    if (type == 'files') {
      for (const file of files) {
        const reader = new FileReader()
        const [ mime ] = file.type.split('/')
        if (mime != 'image') continue

        reader.addEventListener('load', () => {
          editor.change((c) => {
            c.call(insertImage, reader.result, target)
          })
        })

        reader.readAsDataURL(file)
      }
    }

    if (type == 'text') {
      if (!isUrl(text)) return
      if (!isImage(text)) return
      change.call(insertImage, text, target)
    }
  }

}

/**
 * Export.
 */

export default Images
