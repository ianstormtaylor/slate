/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ value, keys }) {
  keys.forEach(key => {
    value.document.hasNode(key)
  })
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
const keys = value.document
  .getTexts()
  .toArray()
  .map(t => t.key)

module.exports.input = function() {
  return { value, keys }
}
