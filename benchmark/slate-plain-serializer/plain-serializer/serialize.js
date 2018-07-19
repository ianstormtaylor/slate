/** @jsx h */
/* eslint-disable react/jsx-key */

const Plain = require('slate-plain-serializer').default
const h = require('../../helpers/h')

module.exports.default = function(state) {
  Plain.serialize(state)
}

module.exports.input = (
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
