import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import { css } from 'emotion'
import initialValueAsJson from './value.json'
import { Icon } from '../components'
import { createArrayValue } from 'react-values'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

const EventsValue = createArrayValue()

const Wrapper = React.forwardRef((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={css`
      position: relative;
    `}
  />
))

const EventsWrapper = props => (
  <div
    {...props}
    className={css`
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      max-height: 40vh;
      height: 500px;
      overflow: auto;
      border-top: 1px solid #ccc;
      background: white;
    `}
  />
)

const EventsTable = props => (
  <table
    {...props}
    className={css`
      font-family: monospace;
      font-size: 0.9em;
      border-collapse: collapse;
      border: none;
      min-width: 100%;

      & > * + * {
        margin-top: 1px;
      }

      tr,
      th,
      td {
        border: none;
      }

      th,
      td {
        text-align: left;
        padding: 0.333em;
      }

      th {
        position: sticky;
        top: 0;
        background-color: #eee;
        border-bottom: 1px solid #ccc;
      }

      td {
        background-color: white;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
    `}
  />
)

const Pill = ({ color, ...props }) => (
  <span
    className={css`
      display: inline-block;
      padding: 0.25em 0.33em;
      border-radius: 4px;
      background-color: ${color};
    `}
  />
)

const I = ({ color, ...props }) => (
  <Icon
    className={css`
      font-size: 0.9em;
      color: ${color};
    `}
  />
)

const MissingCell = () => <I color="silver">texture</I>

const TypeCell = ({ event }) => {
  switch (event.constructor.name) {
    case 'CompositionEvent':
      return <Pill color="thistle">{event.type}</Pill>
    case 'InputEvent':
      return <Pill color="lightskyblue">{event.type}</Pill>
    case 'KeyboardEvent':
      return <Pill color="wheat">{event.type}</Pill>
    case 'Event':
      return <Pill color="#ddd">{event.type}</Pill>
    default:
      return <Pill color="palegreen">{event.type}</Pill>
  }
}

const BooleanCell = ({ value }) =>
  value === true ? (
    <I color="mediumseagreen">check</I>
  ) : value === false ? (
    <I color="tomato">clear</I>
  ) : (
    <MissingCell />
  )

const StringCell = ({ value }) =>
  value == null ? <MissingCell /> : JSON.stringify(value)

const RangeCell = ({ value }) =>
  value == null ? (
    <MissingCell />
  ) : (
    `${value.anchor.path.toJSON()}.${
      value.anchor.offset
    }–${value.focus.path.toJSON()}.${value.focus.offset}`
  )

const EventsList = () => (
  <EventsValue>
    {({ value: events }) => (
      <EventsWrapper>
        <EventsTable>
          <thead>
            <tr>
              <th>
                <I
                  color="#666"
                  style={{ cursor: 'pointer' }}
                  onMouseDown={e => {
                    e.preventDefault()
                    EventsValue.clear()
                  }}
                >
                  block
                </I>
              </th>
              <th>type</th>
              <th>key</th>
              <th>code</th>
              <th>repeat</th>
              <th>inputType</th>
              <th>data</th>
              <th>dataTransfer</th>
              <th>targetRange</th>
              <th>isComposing</th>
              <th>findSelection</th>
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
      <td />
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
        <BooleanCell value={event.repeat} />
      </td>
      <td>
        <StringCell value={event.inputType} />
      </td>
      <td>
        <StringCell value={event.data} />
      </td>
      <td>
        <StringCell
          value={event.dataTransfer && event.dataTransfer.getData('text/plain')}
        />
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

class InputTester extends React.Component {
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
    window.document.addEventListener('selectionchange', this.onEvent)
  }

  ref = editor => {
    this.editor = editor
  }

  render() {
    return (
      <Wrapper ref={this.onRef}>
        <Editor
          spellCheck
          placeholder="Enter some text..."
          ref={this.ref}
          defaultValue={initialValue}
          onChange={this.onChange}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
        />
        <EventsList />
      </Wrapper>
    )
  }

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props

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
      default:
        return next()
    }
  }

  renderMark = (props, editor, next) => {
    const { attributes, children, mark } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  onRef = ref => {
    this.el = ref
  }

  onChange = ({ value }) => {
    this.setState({ value })
    this.recordEvent({ type: 'change' })
    this.logEvent({ type: 'change' })
  }

  onEvent = event => {
    this.recordEvent(event)
    this.logEvent(event)
  }

  recordEvent = event => {
    const { editor } = this
    const { value } = editor
    let targetRange

    if (event.getTargetRanges) {
      const [nativeTargetRange] = event.getTargetRanges()
      targetRange = nativeTargetRange && editor.findRange(nativeTargetRange)
    }

    const nativeSelection = window.getSelection()
    const nativeRange = nativeSelection.rangeCount
      ? nativeSelection.getRangeAt(0)
      : undefined
    const selection = nativeRange && editor.findRange(nativeRange)

    EventsValue.push({
      event,
      value,
      targetRange,
      selection,
    })
  }

  logEvent = event => {
    const { editor } = this
    const { value } = editor
    const nativeSelection = window.getSelection()
    const nativeRange = nativeSelection.rangeCount
      ? nativeSelection.getRangeAt(0)
      : undefined
    const selection = nativeRange && editor.findRange(nativeRange)

    const {
      type,
      key,
      code,
      inputType,
      data,
      dataTransfer,
      isComposing,
    } = event

    const prefix = `%c${type.padEnd(15)}`
    let style = 'padding: 3px'
    let details

    switch (event.constructor.name) {
      case 'CompositionEvent': {
        style += '; background-color: thistle'
        details = { data, selection, value }
        break
      }

      case 'InputEvent': {
        style += '; background-color: lightskyblue'
        const [nativeTargetRange] = event.getTargetRanges()
        const targetRange =
          nativeTargetRange && editor.findRange(nativeTargetRange)

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

      case 'Event': {
        style += '; background-color: #ddd'
        details = { isComposing, selection, value }
        break
      }

      default: {
        style += '; background-color: palegreen'
        details = { selection, value }
        break
      }
    }

    console.log(prefix, style, details) // eslint-disable-line no-console
  }
}

export default InputTester
