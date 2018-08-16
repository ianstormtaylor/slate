/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .normalize()
    .moveForward(5)
    .normalize()
    .moveForward(5)
    .normalize()
    .moveForward(5)
    .normalize()
    .moveForward(5)
    .normalize()
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
