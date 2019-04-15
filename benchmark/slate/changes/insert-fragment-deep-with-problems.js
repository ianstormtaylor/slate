/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

const fragment = (
  <document>
    <table>
      <thead>
        <tr>
          <th>
            <paragraph>Column 1</paragraph>
          </th>
          <th>
            <paragraph>Column 2</paragraph>
          </th>
          <th>
            <paragraph>Column 3</paragraph>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from(10).map(n => (
          <tr key={n}>
            <td>
              <paragraph>Plain text</paragraph>
            </td>
            <td>
              <paragraph>
                <b>Bolded text</b>
              </paragraph>
            </td>
            <td />
          </tr>
        ))}
      </tbody>
    </table>
    <list>
      <item>
        <paragraph>Plain text</paragraph>
      </item>
      <item>
        <emoji />
      </item>
      <item />
    </list>
  </document>
)

module.exports.default = function(editor) {
  editor.insertFragment(fragment)
}

const value = (
  <value>
    <document>
      <paragraph>
        Some initial text.<cursor />
      </paragraph>
    </document>
  </value>
)

module.exports.input = function() {
  return new Editor({ value })
}
