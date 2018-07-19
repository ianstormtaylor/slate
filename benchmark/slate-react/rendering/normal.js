/** @jsx h */
/* eslint-disable react/jsx-key */

const React = require('react')
const ReactDOM = require('react-dom/server')
const h = require('../../helpers/h')
const { Editor } = require('slate-react')

module.exports.default = function(value) {
  const el = React.createElement(Editor, { value })
  ReactDOM.renderToStaticMarkup(el)
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
