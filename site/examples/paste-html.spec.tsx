import { mount } from '@cypress/react'
import React from 'react'
import Editor from './paste-html'

describe('paste html example', () => {
  beforeEach(() => mount(<Editor />))

  const slateEditor = 'div[data-slate-editor="true"]'
  const createHtmlPasteEvent = (htmlContent: string) =>
    Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
      clipboardData: {
        getData: (type = 'text/html') => htmlContent,
        types: ['text/html'],
      },
    })

  const cyNewPasteHtml = (htmlContent: string) =>
    cy
      .get(slateEditor)
      .type('{selectall}')
      .trigger('paste', createHtmlPasteEvent(htmlContent))

  it('pasted bold text uses <strong>', () => {
    cyNewPasteHtml('<strong>Hello Bold</strong>')
      .get('strong')
      .should('contain.text', 'Hello')
  })

  it('pasted code uses <code>', () => {
    cyNewPasteHtml('<code>console.log("hello from slate!")</code>')
      .get('code')
      .should('contain.text', 'slate!')
  })
})
