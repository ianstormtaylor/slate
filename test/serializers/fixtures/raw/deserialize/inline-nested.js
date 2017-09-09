/** @jsx sugar */

import sugar from '../../../../helpers/sugar'

export const input = {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'inline',
            type: 'link',
            nodes: [
              {
                kind: 'inline',
                type: 'hashtag',
                nodes: [
                  {
                    kind: 'text',
                    ranges: [
                      {
                        text: 'one',
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          <hashtag>
            one
          </hashtag>
        </link>
      </paragraph>
    </document>
  </state>
)
