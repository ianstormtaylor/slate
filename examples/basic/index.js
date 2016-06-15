
import Editor, { State } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * State.
 */

const state = {
  nodes: [
    {
      key: '1',
      kind: 'node',
      type: 'code',
      data: {},
      children: [
        {
          key: '2',
          type: 'text',
          ranges: [
            {
              text: 'A\nfew\nlines\nof\ncode.',
              marks: []
            }
          ]
        }
      ]
    },
    {
      key: '3',
      kind: 'node',
      type: 'paragraph',
      data: {},
      children: [
        {
          key: '4',
          type: 'text',
          ranges: [
            {
              text: 'A ',
              marks: []
            },
            {
              text: 'simple',
              marks: ['bold']
            },
            {
              text: ' paragraph of text.',
              marks: []
            }
          ]
        }
      ]
    }
  ],
  selection: {
    anchorKey: '3.4',
    anchorOffset: 9,
    focusKey: '3.4',
    focusOffset: 18
  }
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
      debugger
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
          console.log('Change:', state.toJS())
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
