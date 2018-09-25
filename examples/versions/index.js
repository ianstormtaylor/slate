import { Value, Operation } from 'slate'
import { Editor } from 'slate-react'

import React from 'react'
import styled from 'react-emotion'

import { Stack } from 'immutable'

import { Button, Icon, Toolbar } from '../components'

const initialVersionState = [
  {
    name: 'root',
    isRoot: true,
    value: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This example shows versions.',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'version 1',
    changes: [
      [
        Operation.create({
          object: 'operation',
          path: [0, 0],
          position: 28,
          properties: {
            data: {},
            type: undefined,
          },
          target: null,
          type: 'split_node',
        }),
        Operation.create({
          object: 'operation',
          path: [0],
          position: 1,
          properties: {
            data: {},
            type: 'paragraph',
          },
          target: 28,
          type: 'split_node',
        }),
      ],
      [
        Operation.create({
          marks: [],
          object: 'operation',
          offset: 0,
          path: [1, 0],
          text: 'Try adding a new version by clicking the + icon.',
          type: 'insert_text',
        }),
      ],
    ],
  },
]

export const VersionList = styled('ul')``

export const VersionListItem = styled('li')`
  cursor: pointer;
  color: ${props => (props.active ? 'red' : 'black')};
`

export const Version = ({ active, onClick, name }) => (
  <VersionListItem active={active} onClick={onClick}>
    {name}
  </VersionListItem>
)

/**
 * The versions example.
 *
 * @type {Component}
 */

class Versions extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialVersionState[0].value),
    versions: initialVersionState,
    activeVersionIndex: 0,
  }

  /**
   * Resets the history stack
   *
   */

  resetHistory = () => {
    let { value } = this.state
    const change = value.change()

    const history = value.history
      .set('undos', new Stack())
      .set('redos', new Stack())
    value = value.set('history', history)
    change.value = value

    this.onChange(change)
  }

  /**
   * Sets a version as the active version
   *
   * @param {Number} index
   */

  setVersion = index => {
    const { value, versions, activeVersionIndex } = this.state

    if (index === activeVersionIndex) {
      return
    }

    this.resetHistory()

    const change = value.change()
    const version = versions[index]

    // the root just has a value so set it explicitly.
    if (version.isRoot) {
      this.setState({
        activeVersionIndex: index,
        value: Value.fromJSON(version.value),
      })
    } else {
      const isForward = index > activeVersionIndex

      let operationsToApply

      if (isForward) {
        operationsToApply = versions
          .slice(activeVersionIndex + 1, index + 1)
          .map(v => v.changes.flat())
          .flat()
      } else {
        operationsToApply = versions
          .slice(index + 1, activeVersionIndex + 1)
          .map(v => v.changes.flat())
          .flat()
          .reverse()
          .map(op => op.invert())
      }

      change.withoutNormalizing(() => {
        change.withoutSaving(() => {
          change.applyOperations(operationsToApply)
        })
      })

      this.onChange(change)
      this.setState({ activeVersionIndex: index })
    }
  }

  /**
   * Creates a version below the active version
   *
   */

  addVersion = () => {
    /*
    */

    const versionName = window.prompt('How do you want to call this version?')

    if (!versionName) {
      return
    }

    const { value, versions, activeVersionIndex } = this.state
    const { history } = value

    const newVersion = {
      name: versionName,
      value: this.state.value.toJSON(),
      changes: history.undos
        .toArray()
        .reverse()
        .map(list => list.toArray()),
    }

    this.setState({
      versions: [...versions, newVersion],
      activeVersionIndex: activeVersionIndex + 1,
    })

    this.resetHistory()
  }

  /**
   * Check if we are at the last version
   *
   * @returns {Boolean}
   */

  atTail = () => {
    const { versions, activeVersionIndex } = this.state

    return versions.length - 1 === activeVersionIndex
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    const { value, versions, activeVersionIndex } = this.state
    const { history } = value

    return (
      <div>
        <VersionList>
          {versions.map((version, index) => (
            <Version
              key={index}
              name={version.name}
              active={index === activeVersionIndex}
              onClick={() => this.setVersion(index)}
            />
          ))}
        </VersionList>
        <Toolbar>
          <Button active={history.undos.size} onMouseDown={this.addVersion}>
            <Icon>add</Icon>
          </Button>
          <span>Undos: {history.undos.size}</span>
          <span>Redos: {history.redos.size}</span>
        </Toolbar>
        <Editor
          readOnly={!this.atTail()}
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }
}

export default Versions
