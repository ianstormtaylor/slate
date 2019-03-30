import { Editor, getEventTransfer } from 'slate-react'
import { Value, Point } from 'slate'

import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import React from 'react'
import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(event) {
    editor.setNodeByKey(node.key, { data: { language: event.target.value } })
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code {...props.attributes}>{props.children}</code>
      </pre>
      <div
        contentEditable={false}
        style={{ position: 'absolute', top: '5px', right: '5px' }}
      >
        <select value={language} onChange={onChange}>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  )
}

function CodeBlockLine(props) {
  return <div {...props.attributes}>{props.children}</div>
}

/**
 * A helper function to return the content of a Prism `token`.
 *
 * @param {Object} token
 * @return {String}
 */

function getContent(token) {
  if (typeof token === 'string') {
    return token
  } else if (typeof token.content === 'string') {
    return token.content
  } else {
    return token.content.map(getContent).join('')
  }
}

/**
 *
 * @param {Point} point
 * @param {Document} document
 */

function normalizePoint(point, document) {
  return point.path ? point : point.normalize(document)
}

/**
 * A helper function to normalize path of `point` with cache for performance
 * @param {Array} pointCache
 * @param {Node} textNode
 * @param {Document} document
 */

function withPointCache(pointCache, textNode, document) {
  if (pointCache[0] !== textNode) {
    pointCache[0] = textNode

    pointCache[1] = normalizePoint(
      pointCache[1].moveToStartOfNode(textNode),
      document
    )
  }
  return pointCache[1]
}

const CODE_SYNTAX_MARKS = {}

/**
 * The code highlighting example.
 *
 * @type {Component}
 */

class CodeHighlighting extends React.Component {
  /**
   * Render.
   *
   * @return {Component}
   */

  render() {
    return (
      <Editor
        placeholder="Write some code..."
        defaultValue={initialValue}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        decorateNode={this.decorateNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeBlock {...props} />
      case 'code_line':
        return <CodeBlockLine {...props} />
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    if (CODE_SYNTAX_MARKS[mark.type]) {
      const className = `token ${mark.type}`
      return (
        <span {...attributes} className={className}>
          {children}
        </span>
      )
    }
    return next()
  }

  /**
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onKeyDown = (event, editor, next) => {
    const { value } = editor
    const { startBlock } = value

    if (event.key === 'Enter' && startBlock.type === 'code') {
      editor.insertText('\n')
      return
    }

    next()
  }

  /**
   * Decorate code blocks with Prism.js highlighting.
   *
   * @param {Node} node
   * @return {Array}
   */

  decorateNode = (node, editor, next) => {
    const others = next() || []
    if (node.type !== 'code') return others

    const language = node.data.get('language')
    const texts = node.getTexts().toArray()
    const string = texts.map(t => t.text).join('\n')
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    const decorations = []
    let startText = texts.shift()
    let endText = startText
    let startOffset = 0
    let endOffset = 0
    let start = 0

    const document = editor.value.document
    const pointCache = [null, Point.create({})]

    for (const token of tokens) {
      startText = endText
      startOffset = endOffset

      const content = getContent(token)
      const length = content.length
      const end = start + length

      let available = startText.text.length - startOffset
      let remaining = length

      endOffset = startOffset + remaining

      while (available < remaining && texts.length > 0) {
        endText = texts.shift()
        // Should consider line break carefully. The original way has a bug when dealing with cross-line syntax token
        // And there are performance benefits in this way, better than `split` way.
        remaining = remaining - available - 1
        available = endText.text.length
        endOffset = remaining
      }

      if (typeof token !== 'string') {
        const dec = {
          anchor: {
            key: startText.key,
            path: withPointCache(pointCache, startText, document).path,
            offset: startOffset,
          },
          focus: {
            key: endText.key,
            path: withPointCache(pointCache, endText, document).path,
            offset: endOffset,
          },
          mark: {
            type: token.type,
          },
        }

        if (!CODE_SYNTAX_MARKS[token.type]) {
          // Handling token marks intelligently
          CODE_SYNTAX_MARKS[token.type] = true
        }

        decorations.push(dec)
      }

      start = end
    }

    return [...others, ...decorations]
  }

  /**
   * On paste inside code blocks, insert code lines . Fix the original error of pasting html content.
   * Note that: paste any unknown html, fragment content should not be supported in code blocks
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onPaste = (event, editor, next) => {
    const { startBlock } = editor.value

    if (startBlock.type === 'code_line') {
      const transfer = getEventTransfer(event)
      const text = transfer.text

      if (text) {
        const textLines = text.split('\n'),
          codeLines = []

        for (const i in textLines) {
          codeLines.push({
            object: 'block',
            type: 'code_line',
            nodes: [
              {
                object: 'text',
                leaves: [{ text: textLines[i] }],
              },
            ],
          })
        }

        const valueJSON = {
          object: 'value',
          document: {
            object: 'document',
            nodes: codeLines,
          },
        }

        const fragment = Value.fromJSON(valueJSON)
        editor.insertFragment(fragment.document)
      }
      return
    }
    return next()
  }
}

/**
 * Export.
 */

export default CodeHighlighting
