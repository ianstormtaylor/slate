
import Editor, { Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'

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
              text: 'Since it\'s rich text, you can do things like turn a selection of text ',
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

  render() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => this.renderNode(node)}
          renderMark={mark => this.renderMark(mark)}
          onKeyDown={(e, state) => this.onKeyDown(e, state)}
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
      case 'heading-three': {
        return (props) => <h3>{props.children}</h3>
      }
      case 'heading-four': {
        return (props) => <h4>{props.children}</h4>
      }
      case 'heading-five': {
        return (props) => <h5>{props.children}</h5>
      }
      case 'heading-six': {
        return (props) => <h6>{props.children}</h6>
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

  onKeyDown(e, state) {
    const key = keycode(e.which)
    if (key != 'space') return
    if (state.isCurrentlyExpanded) return
    let { selection } = state
    const { currentTextNodes, document } = state
    const { startOffset } = selection
    const node = currentTextNodes.first()
    const { text } = node
    const chars = text.slice(0, startOffset).replace(/\s*/g, '')
    let transform = state.transform()

    switch (chars) {
      case '#':
        transform = transform.setType('header-one')
        break
      case '##':
        transform = transform.setType('header-two')
        break
      case '###':
        transform = transform.setType('header-three')
        break
      case '####':
        transform = transform.setType('header-four')
        break
      case '#####':
        transform = transform.setType('header-five')
        break
      case '######':
        transform = transform.setType('header-six')
        break
      case '>':
        transform = transform.setType('block-quote')
        break
      case '-':
        transform = transform.setType('list-item')
        if (wrapper.type == 'paragraph') transform = transform.setType('bulleted-list')
        if (wrapper.type == 'bulleted-list') transform = transform.wrap('list-item')
        if (wrapper.type == 'list-item') transform = transform.wrap('unordered-list')
        break
      default:
        return
    }


    state = transform
      .deleteAtRange(selection.extendBackwardToStartOf(node))
      .apply()

    selection = selection.moveToStartOf(node)
    state = state.merge({ selection })
    e.preventDefault()
    return state
  }

}

/**
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
