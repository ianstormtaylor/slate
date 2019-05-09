import React from 'react'
import { css } from 'emotion'

export default function WordCount(options) {
  return {
    renderEditor(props, editor, next) {
      const { value } = editor
      const { document } = value
      const children = next()
      let wordCount = 0

      for (const [node] of document.blocks({ onlyLeaves: true })) {
        const words = node.text.trim().split(/\s+/)
        wordCount += words.length
      }

      return (
        <div>
          <div>{children}</div>
          <span
            className={css`
              margin-top: 10px;
              padding: 12px;
              background-color: #ebebeb;
              display: inline-block;
            `}
          >
            Word Count: {wordCount}
          </span>
        </div>
      )
    },
  }
}
