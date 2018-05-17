/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ change, keys }) {
  for (const key of keys) {
    change.insertTextByKey(key, 0, 'a')
  }
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
              {i == 0 ? <cursor /> : ''}
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
  const change = value.change()
  return { change, keys }
}
