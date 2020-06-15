/** @jsx h */
/* eslint-disable react/jsx-key */

const Plain = require('slate-plain-serializer').default

const input = `
  This is editable plain text, just like a text area.
`
  .trim()
  .repeat(10)

module.exports.input = input

module.exports.default = function(string) {
  Plain.deserialize(string)
}
