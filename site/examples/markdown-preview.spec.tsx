import { mount } from '@cypress/react'
import React from 'react'
import Editor from './markdown-preview'

describe('markdown preview', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  const markdown = 'span[data-slate-string="true"]'

  beforeEach(() => {
    mount(<Editor />)
  })

  it('checks for markdown', () => {
    cy.get(slateEditor)
      .find(markdown)
      .should('have.length', 9)

    cy.get(slateEditor)
      .type('{movetoend}{enter}## Try it out!{enter}')
      .find(markdown)
      .should('have.length', 10)
  })
})
