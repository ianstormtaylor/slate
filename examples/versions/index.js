import { Value } from 'slate'
import { Editor } from 'slate-react'
import React from 'react'
import { List } from 'immutable'

import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

/**
 * Commands.
 *
 * @type {Object}
 */

const commands = {
  resetHistory(editor) {
    const { value } = editor
    const { data } = value
    const newData = data.set('undos', List()).set('redos', List())

    editor.withoutSaving(() => {
      editor.setData(newData)
    })
  },
}

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
    value: Value.fromJSON(initialValue),
    versions: [],
    v: '',
  }

  /**
   * On mounting, save an initial version.
   */

  componentDidMount() {
    this.saveVersion()
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    const { value, versions, v } = this.state
    return (
      <div>
        <Toolbar>
          <select value={v} onChange={this.onVersionSelectChange}>
            <option disabled>Choose a version to rollback to...</option>
            {versions.map((version, i) => {
              const { createdAt } = version
              const time = createdAt.toLocaleTimeString()
              const name = `Version ${i + 1} — ${time}`
              return (
                <option key={i} value={i}>
                  {name}
                </option>
              )
            })}
          </select>
          <Button onMouseDown={this.saveVersion}>
            <Icon>add</Icon> Save Version
          </Button>
        </Toolbar>
        <Editor
          placeholder="Enter some text..."
          commands={commands}
          ref={this.ref}
          value={value}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => this.setState(() => ({ value }))

  /**
   * On version select change.
   *
   * @param {Event} event
   */

  onVersionSelectChange = event => {
    const { value } = event.target
    const n = parseInt(value, 10)
    this.setVersion(n)
  }

  /**
   * Set the current version to version number `n`.
   *
   * @param {Number} n
   */

  setVersion = n => {
    const { editor } = this
    const { versions, v } = this.state
    if (n === v) return

    const operations = versions
      .slice(n + 1, v + 1)
      .reduce((acc, val) => acc.concat(val.operations), []) // Make a flat array of all version operations
      .reverse()
      .map(op => op.invert())

    editor.withoutNormalizing(() => {
      editor.withoutSaving(() => {
        operations.forEach(op => editor.applyOperation(op))
        editor.resetHistory()
      })
    })

    setTimeout(() =>
      this.setState(state => ({
        versions: state.versions.slice(0, n + 1),
        v: n,
      }))
    )
  }

  /**
   * Save a new version checkpoint to the version history.
   */

  saveVersion = () => {
    const { value } = this.state
    const { data } = value
    const undos = data.get('undos') || List()

    const version = {
      createdAt: new Date(),
      operations: undos.flatten(1).toArray(),
    }

    this.setState(
      state => ({
        versions: [...state.versions, version],
        v: state.v === '' ? 0 : state.v + 1,
      }),
      () => {
        this.editor.resetHistory()
      }
    )
  }
}

export default Versions
