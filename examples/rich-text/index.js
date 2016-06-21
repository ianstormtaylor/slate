
import Editor, { Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'

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
    },
    {
      type: 'paragraph',
      nodes: [
        {
          type: 'text',
          ranges: [
            {
              text: 'Since it\'s rich text, you can do things like turn a selection of text ',
            },
            {
              text: 'bold',
              marks: [
                {
                  type: 'bold'
                }
              ]
            },{
              text: ', or add a semanticlly rendered block quote in the middle of the page, like this:'
            }
          ]
        }
      ]
    },
    {
      type: 'block-quote',
      nodes: [
        {
          type: 'text',
          ranges: [
            {
              text: 'A wise quote.'
            }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      nodes: [
        {
          type: 'text',
          ranges: [
            {
              text: 'Try it out for yourself!'
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

  hasMark(type) {
    const { state } = this.state
    const { currentMarks } = state
    return currentMarks.some(mark => mark.type == type)
  }

  hasBlock(type) {
    const { state } = this.state
    const { currentWrappingNodes } = state
    return currentWrappingNodes.some(node => node.type == type)
  }

  onClickMark(e, type) {
    e.preventDefault()
    const isActive = this.hasMark(type)
    let { state } = this.state

    state = state
      .transform()
      [isActive ? 'unmark' : 'mark'](type)
      .apply()

    this.setState({ state })
  }

  onClickBlock(e, type) {
    e.preventDefault()
    const isActive = this.hasBlock(type)
    let { state } = this.state

    state = state
      .transform()
      .setType(isActive ? 'paragraph' : type)
      .apply()

    this.setState({ state })
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
    const isBold = this.hasMark('bold')
    const isCode = this.hasMark('code')
    const isItalic = this.hasMark('italic')
    const isUnderlined = this.hasMark('underlined')

    return (
      <div className="menu">
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'looks_one')}
        {this.renderBlockButton('heading-two', 'looks_two')}
        {this.renderBlockButton('block-quote', 'format_quote')}
        {this.renderBlockButton('numbered-list', 'format_list_numbered')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
      </div>
    )
  }

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    return (
      <span className="button" onClick={e => this.onClickMark(e, type)} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderBlockButton(type, icon) {
    const isActive = this.hasBlock(type)
    return (
      <span className="button" onClick={e => this.onClickBlock(e, type)} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
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
            console.groupCollapsed('Change!')
            console.log('Document:', state.document.toJS())
            console.log('Selection:', state.selection.toJS())
            console.log('Content:', Raw.serialize(state))
            console.groupEnd()
            this.setState({ state })
          }}
        />
      </div>
    )
  }

  renderNode(node) {
    switch (node.type) {
      case 'block-quote': {
        return (props) => <blockquote>{props.children}</blockquote>
      }
      case 'bulleted-list': {
        return (props) => <ul>{props.chidlren}</ul>
      }
      case 'heading-one': {
        return (props) => <h1>{props.children}</h1>
      }
      case 'heading-two': {
        return (props) => <h2>{props.children}</h2>
      }
      case 'list-item': {
        return (props) => <li>{props.chidlren}</li>
      }
      case 'numbered-list': {
        return (props) => <ol>{props.children}</ol>
      }
      case 'paragraph': {
        return (props) => <p>{props.children}</p>
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
      case 'code': {
        return {
          fontFamily: 'monospace',
          backgroundColor: '#eee',
          padding: '3px',
          borderRadius: '4px'
        }
      }
      case 'italic': {
        return {
          fontStyle: 'italic'
        }
      }
      case 'underlined': {
        return {
          textDecoration: 'underline'
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
