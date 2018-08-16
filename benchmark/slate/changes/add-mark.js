/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .addMark('bold')
    .moveForward(5)
    .addMark('bold')
    .moveForward(5)
    .addMark('bold')
    .moveForward(5)
    .addMark('bold')
    .moveForward(5)
    .addMark('bold')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable {i == 0 ? <anchor /> : ''}rich{i == 0 ? (
                <focus />
              ) : (
                ''
              )}{' '}
              text, <i>much</i> better than a textarea! For reals.
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
