/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ value, first, last }) {
  value.document.getCommonAncestor(first.key, last.key)
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

const first = value.document.getFirstText()
const last = value.document.getLastText()

module.exports.input = function() {
  return { value, first, last }
}
