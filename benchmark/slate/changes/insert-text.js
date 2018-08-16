/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .insertText('one')
    .moveForward(5)
    .insertText('two')
    .moveForward(5)
    .insertText('three')
    .moveForward(5)
    .insertText('four')
    .moveForward(5)
    .insertText('five')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              {i == 0 ? <cursor /> : ''}
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = function() {
  return value.change()
}
