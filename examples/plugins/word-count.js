import React from 'react'
import styled from 'react-emotion'

const WordCounter = styled('span')`
  margin-top: 10px;
  padding: 12px;
  background-color: #ebebeb;
  display: inline-block;
`

export default function WordCount(options) {
  return {
    renderEditor(props, editor, next) {
      const { value } = props
      const { document } = value
      const children = next()
      let wordCount = 0

      for (const [node] of document.blocks({ leaf: true })) {
        const words = node.text.trim().split(/\s+/)
        wordCount += words.length
      }

      return (
        <div>
          <div>{children}</div>
          <WordCounter>Word Count: {wordCount}</WordCounter>
        </div>
      )
    },
  }
}
