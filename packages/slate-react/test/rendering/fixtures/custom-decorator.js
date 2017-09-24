/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  nodes: {
    paragraph: {
      decorate(block) {
        const text = block.getFirstText()
        return [{
          anchorKey: text.key,
          anchorOffset: 1,
          focusKey: text.key,
          focusOffset: 2,
          marks: [{ type: 'bold' }]
        }]
      }
    }
  },
  marks: {
    bold: {
      fontWeight: 'bold',
    }
  }
}

export const state = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>o</span>
      <span><span style="font-weight:bold">n</span></span>
      <span>e</span>
    </span>
  </div>
</div>
`.trim()
