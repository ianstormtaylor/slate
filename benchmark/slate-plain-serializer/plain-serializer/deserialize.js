/** @jsx h */
/* eslint-disable react/jsx-key */

import Plain from '../..'

export default function(string) {
  Plain.deserialize(string)
}

export const input = `
  This is editable plain text, just like a text area.
`
  .trim()
  .repeat(10)
