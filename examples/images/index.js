
import { Editor } from 'slate-react'
import { Block, State } from 'slate'

import React from 'react'
import initialState from './state.json'
import isImage from 'is-image'
import isUrl from 'is-url'

/**
 * Default block to be inserted when the document is empty,
 * and after an image is the last node in the document.
 *
 * @type {Object}
 */

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    image: (props) => {
      const { node, isSelected } = props
      const src = node.data.get('src')
      const className = isSelected ? 'active' : null
      return (
        <img src={src} className={className} {...props.attributes} />
      )
    },
    paragraph: (props) => {
      return <p {...props.attributes}>{props.children}</p>
    }
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty.
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        return document.nodes.size ? null : true
      },
      normalize: (change, document) => {
        const block = Block.create(defaultBlock)
        change.insertNodeByKey(document.key, 0, block)
      }
    },
    // Rule to insert a paragraph below a void node (the image) if that node is
    // the last one in the document.
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        const lastNode = document.nodes.last()
        return lastNode && lastNode.isVoid ? true : null
      },
      normalize: (change, document) => {
        const block = Block.create(defaultBlock)
        change.insertNodeByKey(document.key, document.nodes.size, block)
      }
    }
  ]
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Selection} target
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
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState)
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
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
          onDrop={this.onDrop}
          onPaste={this.onPaste}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
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

    const change = this.state.state
      .change()
      .call(insertImage, src)

    this.onChange(change)
  }

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  onDrop = (e, data, change, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, change, editor)
    }
  }

  /**
   * On drop or paste files, read and insert the image files.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  onDropOrPasteFiles = (e, data, change, editor) => {
    for (const file of data.files) {
      const reader = new FileReader()
      const [ type ] = file.type.split('/')
      if (type != 'image') continue

      reader.addEventListener('load', () => {
        editor.change((t) => {
          t.call(insertImage, reader.result, data.target)
        })
      })

      reader.readAsDataURL(file)
    }
  }

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  onPaste = (e, data, change, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, change, editor)
      case 'text': return this.onPasteText(e, data, change)
    }
  }

  /**
   * On paste text, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  onPasteText = (e, data, change) => {
    if (!isUrl(data.text)) return
    if (!isImage(data.text)) return
    change.call(insertImage, data.text, data.target)
  }

}

/**
 * Export.
 */

export default Images
