/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

interface MentionProps {
  id: string
  children: unknown
}

function Mention(props: MentionProps) {
  return (
    <element inline id={props.id}>
      {props.children}
    </element>
  )
}

export const input = (
  <element>
    This is <Mention id="alice-123">Alice</Mention>.
  </element>
)

export const output = {
  children: [
    { text: 'This is ' },
    {
      inline: true,
      id: 'alice-123',
      children: [{ text: 'Alice' }],
    },
    { text: '.' },
  ],
}
