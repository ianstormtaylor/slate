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
    renderEditor(props, next) {
      const children = next()
      return (
        <div>
          <div>{children}</div>
          <WordCounter>
            Word Count: {props.value.document.text.split(' ').length}
          </WordCounter>
        </div>
      )
    },
  }
}
