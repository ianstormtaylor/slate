
import { Editor, Mark, Raw } from '../..'
import React from 'react'
import initialState from './state.json'
/* global Prism */
// Prism is loaded in ../index.html or ./dev.html


/**
 * The code highlighting example.
 *
 * @type {Component}
 */

class CodeHighlighting extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown = (e, data, state) => {
    if (data.key != 'enter') return
    const { startBlock } = state
    if (startBlock.type != 'code') return

    const transform = state.transform()
    if (state.isExpanded) transform.delete()
    transform.insertText('\n')

    return transform.apply()
  }

  /**
   * Render.
   *
   * @return {Component}
   */

  render = () => {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
        />
      </div>
    )
  }

}


/**
 * Render a Dropdown in the CodeBlock to choose the highlighting language
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(e) {
    const state = editor.getState()
    const next = state
      .transform()
      .setNodeByKey(node.key, {
        data: {
          language: e.target.value
        }
      })
      .apply()
    editor.onChange(next)
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
        <select value={language} onChange={onChange} >
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>
    </div>
  )
}

/**
 * Define a Prism.js decorator
 * Prism is a syntax highlighter.
 * http://prismjs.com
 *
 * @param {Text} text
 * @param {Block} block
 */

function prismDecorator(text, block) {
  let characters = text.characters.asMutable()
  const string = text.text

  // Get the Prism-Language from the Block
  // Existing Languages: http://prismjs.com/#languages-list
  const language = block.data.get('language')
  const grammar = Prism.languages[language]

  // Prism will split the string in nested tokes
  // These tokens contain the information to style the characters
  const tokens = Prism.tokenize(string, grammar)

  // Current Token position in the string
  const offset = 0

  characters = mergePrismTokensInCharacters(characters, tokens, offset)

  return characters.asImmutable()
}


/**
 * Define Marks by the Prism tokens and add them to the characters
 *
 * @param {Characters} characters
 * @param {Array<PrimsTokens>} tokens
 * @param {number} [offset=0]
 * @returns
 */

function mergePrismTokensInCharacters(characters, tokens, offset = 0) {
  tokens.forEach((token) => {
    if (typeof token == 'string') {
      // It not a token, just is string to indicate the content of the Parent token
      // Nothing to do here
      offset += token.length
      return
    }

    const length = offset + token.length

    // The Type of the Mark
    // This has to be styled in Schema.marks
    const type = token.type

    characters = applyMarksToCharacters(characters, offset, length, type)

    if (Array.isArray(token.content)) {
      // This Tokens has child tokens, same again
      characters = mergePrismTokensInCharacters(characters, token.content, offset)
    }
    offset = length
  })

  return characters
}


/**
 * Adds Marks to the characters in the given range
 *
 * @param {Characters} characters
 * @param {number} offset
 * @param {number} length
 * @param {string} markType
 * @returns {Characters}
 */

function applyMarksToCharacters(characters, offset, length, markType) {
  for (let i = offset; i < length; i++) {
    let char = characters.get(i)
    let { marks } = char
    marks = marks.add(Mark.create({ type: markType }))
    char = char.merge({ marks })
    characters = characters.set(i, char)
  }
  return characters
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    code: {
      render: CodeBlock, // To render the Dropdown
      decorate: prismDecorator, // Could also be applied by a rule https://docs.slatejs.org/reference/models/schema.html#decorate
    }
  },
  marks: {

    // JavaScript marks
    'comment': {
      color: 'slategray',
      fontStyle: 'italic'
    },
    'punctuation': {
      color: 'slategray',
      marginLeft: '3px',
      marginRight: '3px'
    },
    'constant': {
      color: '#905'
    },
    'keyword': {
      fontWeight: 'bold',
      color: '#009'
    },
    'number': {
      color: '#905'
    },
    'boolean': {
      color: '#905'
    },
    'string': {
      color: '#690'
    },

    // CSS Marks
    'selector': {
      color: '#900',
      fontWeight: 'bold',
    },

    // CSS Marks
    'property': {
      color: '#009',
    },

    // Markdown
    'title': {
      fontSize: '25px',
      margin: '20px 0 10px 0',
    },
    'bold': {
      fontWeight: 'bold'
    },
    'italic': {
      fontStyle: 'italic'
    },
    'list': {
      paddingLeft: '5px',
      color: '#c00',
      fontWeigt: 'bold'
    },
    'hr': {
      borderBottom: '2px solid #000',
      display: 'inline-block',
      width: '100%',
      margin: '10px 0',
      opacity: 0.5
    },
    'url': {
      color: '#009',
      textDecoration: 'underline'
    },

    // HTML
    'tag': {
      color: '#009'
    }
  }
}

/**
 * Export.
 */

export default CodeHighlighting
