/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(editor) {
  editor
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This
              {i === 0 ? <cursor /> : null}
              is editable <b>rich</b> text, <i>much</i> better than a textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = function() {
  return new Editor({ value })
}
