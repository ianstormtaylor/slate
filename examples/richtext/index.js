
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
              text: 'This is '
            },
            {
              text: 'editable',
              marks: [
                {
                  type: 'italic'
                }
              ]
            },
            {
              text: ' '
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
              text: ' text, much better than a '
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

  render() {
    return (
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
