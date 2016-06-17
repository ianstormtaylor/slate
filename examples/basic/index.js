
import Editor, { State } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * State.
 */

const state = {
  nodes: [
    {
      type: 'code',
      nodes: [
        {
          type: 'text',
          ranges: [
            {
              text: 'A\nfew\nlines\nof\ncode.'
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
              text: 'A '
            },
            {
              text: 'simple',
              marks: ['bold']
            },
            {
              text: ' paragraph of text.'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Renderers.
 */

function renderNode(node) {
  switch (node.type) {
    case 'code': {
      return (props) => {
        return (
          <pre>
            <code>
              {props.children}
            </code>
          </pre>
        )
      }
    }
    case 'paragraph': {
      return (props) => {
        return (
          <p>
            {props.children}
          </p>
        )
      }
    }
    default: {
      throw new Error(`Unknown node type "${node.type}".`)
    }
  }
}

function renderMark(mark) {
  switch (mark) {
    case 'bold': {
      return {
        fontWeight: 'bold'
      }
    }
    default: {
      throw new Error(`Unknown mark type "${mark}".`)
    }
  }
}

/**
 * App.
 */

class App extends React.Component {

  state = {
    state: State.create(state)
  };

  render() {
    return (
      <Editor
        renderNode={renderNode}
        renderMark={renderMark}
        state={this.state.state}
        onChange={(state) => {
          console.log('State:', state.toJS())
          this.setState({ state })
        }}
      />
    )
  }

}

/**
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
