import { mount } from '@cypress/react'
import Editor from './richtext'

describe('On richtext example', () => {
  beforeEach(() => mount(<Editor />))

  const slateEditor = 'div[data-slate-editor="true"]'
  it('renders rich text', () => {
    cy.get(slateEditor)
      .get('strong')
      .should('contain.text', 'rich')
      .get('blockquote')
      .should('contain.text', 'wise quote')
  })

  it('inserts text when typed', () => {
    cy.get(slateEditor)
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
