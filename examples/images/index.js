
import { Editor, getEventRange, getEventTransfer } from 'slate-react'
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
      const style = { display: 'block' }
      return (
        <img src={src} className={className} style={style} {...props.attributes} />
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

  onDropOrPaste = (e, data, change, editor) => {
    const target = getEventRange(e)
    if (!target) return

    const transfer = getEventTransfer(e)
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
