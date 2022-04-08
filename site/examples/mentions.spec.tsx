import { mount } from '@cypress/react'
import React from 'react'
import Editor from './mentions'

describe('mentions example', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  beforeEach(() => mount(<Editor />))

  it('renders mention element', () => {
    cy.get(slateEditor)
      .get('[data-cy=mention-R2-D2]')
      .should('exist')
      .get('[data-cy=mention-Mace-Windu]')
      .should('exist')
  })

  it('shows list of mentions', () => {
    cy.get(slateEditor)
      .type('{movetoend}')
      .type(' @ma')
      .get('[data-cy=mentions-portal]')
      .should('exist')
  })

  it('inserts on enter from list', () => {
    cy.get(slateEditor)
      .type('{movetoend}')
      .type(' @Ja')
      .type('{enter}')
      .get('[data-cy=mention-Jabba]')
      .should('exist')
  })
})
