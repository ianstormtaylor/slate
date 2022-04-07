import { mount } from '@cypress/react'
import Editor from './plaintext'

describe('plaintext example', () => {
  beforeEach(() => mount(<Editor />))

  it('inserts text when typed', () => {
    cy.get('[data-slate-editor="true"]')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
