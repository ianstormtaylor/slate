import { Editor, findRange } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import styled from 'react-emotion'
import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'
import { createArrayValue } from 'react-values'

const EventsValue = createArrayValue()

const Wrapper = styled('div')`
  position: relative;
`

const EventsWrapper = styled('div')`
  position: fixed;
  background: white;
  border-top: 1px solid #ccc;
  left: 0;
  bottom: 0;
  right: 0;
  max-height: 33vh;
  height: 400px;
  overflow: auto;
`

const EventsTable = styled('table')`
  font-family: monospace;
  font-size: 0.9em;
  border-collapse: collapse;
  border: none;
  min-width: 100%;

  & > * + * {
    margin-top: 1px;
  }

  tr {
    border: none;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
  }

  td,
  th {
    border: none;
    text-align: left;
    padding: 0.5em;
  }

  th > tr:first-child {
    border-top: none;
  }
`

const Spacer = styled('div')`
  height: 20px;
  background-color: #eee;
  margin: 20px -20px;
`

const Pill = styled('span')`
  display: inline-block;
  padding: 0.25em 0.33em;
  border-radius: 4px;
  background-color: ${p => p.color};
`

const I = styled(Icon)`
  font-size: 0.85em;
  color: ${p => p.color};
`

const CompositionCell = props => <Pill color="aquamarine" {...props} />

const InputCell = props => <Pill color="lightskyblue" {...props} />

const KeyboardCell = props => <Pill color="wheat" {...props} />

const TypeCell = ({ event }) => {
  switch (event.constructor.name) {
    case 'CompositionEvent':
      return <CompositionCell>{event.type}</CompositionCell>
    case 'InputEvent':
      return <InputCell>{event.type}</InputCell>
    case 'KeyboardEvent':
      return <KeyboardCell>{event.type}</KeyboardCell>
  }
}

const TrueCell = props => <I color="mediumseagreen">check</I>

const FalseCell = props => <I color="tomato">clear</I>

const MissingCell = props => <I color="silver">texture</I>

const BooleanCell = ({ value }) =>
  value === true ? (
    <TrueCell />
  ) : value === false ? (
    <FalseCell />
  ) : (
    <MissingCell />
  )

const StringCell = ({ value }) =>
  value == null ? <MissingCell /> : JSON.stringify(value)

const RangeCell = ({ value }) =>
  value == null ? (
    <MissingCell />
  ) : (
    `${value.anchor.path.toJSON()}:${
      value.anchor.offset
    }–${value.focus.path.toJSON()}:${value.focus.offset}`
  )

const EventsList = () => (
  <EventsValue>
    {({ value: events }) => (
      <EventsWrapper>
        <EventsTable>
          <thead>
            <tr>
              <th>type</th>
              <th>key</th>
              <th>code</th>
              <th>inputType</th>
              <th>data</th>
              <th>targetRange</th>
              <th>isComposing</th>
              <th>selection</th>
            </tr>
          </thead>
          <tbody>
            {events.map((props, i) => <Event key={i} {...props} />)}
          </tbody>
        </EventsTable>
      </EventsWrapper>
    )}
  </EventsValue>
)

const Event = ({ event, targetRange, selection }) => {
  return (
    <tr>
      <td>
        <TypeCell event={event} />
      </td>
      <td>
        <StringCell value={event.key} />
      </td>
      <td>
        <StringCell value={event.code} />
      </td>
      <td>
        <StringCell value={event.inputType} />
      </td>
      <td>
        <StringCell value={event.data} />
      </td>
      <td>
        <RangeCell value={targetRange} />
      </td>
      <td>
        <BooleanCell value={event.isComposing} />
      </td>
      <td>
        <RangeCell value={selection} />
      </td>
    </tr>
  )
}

const TestEditor = ({ value, onChange }) => (
  <Editor
    spellCheck
    placeholder="Enter some text..."
    value={value}
    onChange={onChange}
    renderNode={({ attributes, children, node }) => {
      switch (node.type) {
        case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
        case 'heading-one':
          return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
          return <h2 {...attributes}>{children}</h2>
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'numbered-list':
          return <ol {...attributes}>{children}</ol>
      }
    }}
    renderMark={({ attributes, children, mark }) => {
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{children}</strong>
        case 'code':
          return <code {...attributes}>{children}</code>
        case 'italic':
          return <em {...attributes}>{children}</em>
        case 'underlined':
          return <u {...attributes}>{children}</u>
      }
    }}
  />
)

class InputTester extends React.Component {
  state = {
    value: Value.fromJSON(initialValue),
  }

  componentDidMount() {
    const editor = this.el.querySelector('[contenteditable="true"]')
    editor.addEventListener('keydown', this.onEvent)
    editor.addEventListener('keyup', this.onEvent)
    editor.addEventListener('keypress', this.onEvent)
    editor.addEventListener('input', this.onEvent)
    editor.addEventListener('beforeinput', this.onEvent)
    editor.addEventListener('compositionstart', this.onEvent)
    editor.addEventListener('compositionupdate', this.onEvent)
    editor.addEventListener('compositionend', this.onEvent)
  }

  render() {
    return (
      <Wrapper innerRef={this.onRef}>
        <Toolbar>
          <Button onMouseDown={EventsValue.clear}>
            <Icon>clear</Icon> Clear
          </Button>
        </Toolbar>
        <TestEditor value={this.state.value} onChange={this.onChange} />
        <EventsList />
      </Wrapper>
    )
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onEvent = event => {
    const { value } = this.state
    const nativeSelection = window.getSelection()
    const nativeRange = nativeSelection.getRangeAt(0)
    const selection = nativeRange && findRange(nativeRange, value)

    const {
      type,
      key,
      code,
      inputType,
      data,
      dataTransfer,
      isComposing,
    } = event

    const prefix = `%c${type.padEnd(12)}`
    let style = 'padding: 3px'
    let details

    switch (event.constructor.name) {
      case 'CompositionEvent': {
        style += '; background-color: aquamarine'
        details = { data, selection, value }
        break
      }

      case 'InputEvent': {
        style += '; background-color: lightskyblue'
        const [nativeRange] = event.getTargetRanges()
        const targetRange = nativeRange && findRange(nativeRange, value)
        details = {
          inputType,
          data,
          dataTransfer,
          targetRange,
          isComposing,
          selection,
          value,
        }
        break
      }

      case 'KeyboardEvent': {
        style += '; background-color: wheat'
        details = { key, code, isComposing, selection, value }
        break
      }
    }

    console.log(prefix, style, details)

    EventsValue.push({ event, value, selection })
  }

  onRef = ref => {
    this.el = ref
  }
}

export default InputTester
