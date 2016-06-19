
import Editor from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import { Raw } from '../..'

/**
 * State.
 */

const state = {
  nodes: [
    {
      type: 'paragraph',
      nodes: [
        {
          type: 'text',
          ranges: [
            {
              text: 'This is editable '
            },
            {
              text: 'rich',
              marks: [
                {
                  type: 'bold'
                }
              ]
            },
            {
              text: ' text, '
            },
            {
              text: 'much',
              marks: [
                {
                  type: 'italic'
                }
              ]
            },
            {
              text: ' better than a '
            },
            {
              text: '<textarea>',
              marks: [
                {
                  type: 'code'
                }
              ]
            },
            {
              text: '!'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * App.
 */

class App extends React.Component {

  state = {
    state: Raw.deserialize(state)
  };

  isMarkActive(type) {
    const { state } = this.state
    const { document, selection } = state
    const { startKey, startOffset } = selection
    const startNode = document.getNode(startKey)
    if (!startNode) return false

    const { characters } = startNode
    const character = characters.get(startOffset)
    const { marks } = character
    return marks.some(mark => mark.type == type)
  }

  onClickMark(e, type) {
    e.preventDefault()

    let { state } = this.state
    const { marks } = state
    const isActive = this.isMarkActive(type)

    state = state
      .transform()
      [isActive ? 'unmark' : 'mark']()
      .apply()

    this.onChange(state)
  }

  render() {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  renderToolbar() {
    const isBold = this.isMarkActive('bold')
    const isItalic = this.isMarkActive('italic')
    const isCode = this.isMarkActive('code')

    return (
      <div className="menu">
        <span className="button" onClick={e => this.onClickMark(e, 'bold')} data-active={isBold}>
          <span className="material-icons">format_bold</span>
        </span>
        <span className="button" onClick={e => this.onClickMark(e, 'italic')} data-active={isItalic}>
          <span className="material-icons">format_italic</span>
        </span>
        <span className="button" onClick={e => this.onClickMark(e, 'code')} data-active={isCode}>
          <span className="material-icons">code</span>
        </span>
      </div>
    )
  }

  renderEditor() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => this.renderNode(node)}
          renderMark={mark => this.renderMark(mark)}
          onChange={(state) => {
            console.log('Document:', state.document.toJS())
            console.log('Content:', Raw.serialize(state))
            this.setState({ state })
          }}
        />
      </div>
    )
  }

  renderNode(node) {
    switch (node.type) {
      case 'paragraph': {
        return (props) => {
          return <p>{props.children}</p>
        }
      }
    }
  }

  renderMark(mark) {
    switch (mark.type) {
      case 'bold': {
        return {
          fontWeight: 'bold'
        }
      }
      case 'italic': {
        return {
          fontStyle: 'italic'
        }
      }
      case 'code': {
        return {
          fontFamily: 'monospace',
          backgroundColor: '#eee',
          padding: '3px',
          borderRadius: '4px'
        }
      }
    }
  }

}

/**
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
