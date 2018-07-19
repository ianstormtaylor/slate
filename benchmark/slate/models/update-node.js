/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ value, next }) {
  value.document.updateNode(next)
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

const texts = value.document.getTexts()
const { size } = texts
const text = texts.get(Math.round(size / 2))
const next = text.insertText(0, 'some text')

module.exports.input = function() {
  return { value, next }
}
