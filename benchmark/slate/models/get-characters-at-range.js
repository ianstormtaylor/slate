/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(value) {
  value.document.getCharactersAtRange(value.selection)
}

module.exports.input = () => {
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
  return value.change().selectAll().value
}
