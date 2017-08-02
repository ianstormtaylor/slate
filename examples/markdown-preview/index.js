
import { Editor, Mark, Plain } from '../..'
import Prism from 'prismjs'
import React from 'react'

/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold);

/**
 * Define a decorator for markdown styles.
 *
 * @param {Text} text
 * @param {Block} block
 */

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable()
  const language = 'markdown'
  const string = text.text
  const grammar = Prism.languages[language]
  const tokens = Prism.tokenize(string, grammar)
  addMarks(characters, tokens, 0)
  return characters.asImmutable()
}

function addMarks(characters, tokens, offset) {
  for (const token of tokens) {
    if (typeof token == 'string') {
      offset += token.length
      continue
    }

    const { content, length, type } = token
    const mark = Mark.create({ type })

    for (let i = offset; i < offset + length; i++) {
      let char = characters.get(i)
      let { marks } = char
      marks = marks.add(mark)
      char = char.set('marks', marks)
      characters.set(i, char)
    }

    if (Array.isArray(content)) {
      addMarks(characters, content, offset)
    }

    offset += length
  }
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  marks: {
    'title': {
      fontWeight: 'bold',
      fontSize: '20px',
      margin: '20px 0 10px 0',
      display: 'inline-block'
    },
    'bold': {
      fontWeight: 'bold'
    },
    'italic': {
      fontStyle: 'italic'
    },
    'punctuation': {
      opacity: 0.2
    },
    'code': {
      fontFamily: 'monospace',
      display: 'inline-block',
      padding: '2px 1px',
    },
    'list': {
      paddingLeft: '10px',
      lineHeight: '10px',
      fontSize: '20px'
    },
    'hr': {
      borderBottom: '2px solid #000',
      display: 'block',
      opacity: 0.2
    }
  },
  rules: [
    {
      match: () => true,
      decorate: markdownDecorator,
    }
  ]
}

/**
 * The markdown preview example.
 *
 * @type {Component}
 */

class MarkdownPreview extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Plain.deserialize('Slate is flexible enough to add **decorators** that can format text based on its content. For example, this editor has **Markdown** preview decorators on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.\n## Try it out!\nTry it out for yourself!')
  }

  /**
   *
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

}

/**
 * Export.
 */

export default MarkdownPreview
