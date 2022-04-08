import { mount } from '@cypress/react'
import React from 'react'
import Editor from './hovering-toolbar'

describe('hovering toolbar example', () => {
  beforeEach(() => {
    mount(<Editor />)
  })

  const hoveringToolbar = '[data-testid="hovering-toolbar"]'

  it('hovering toolbar appears', () => {
    cy.get(hoveringToolbar).should('not.be.visible')

    cy.get('span[data-slate-string="true"]')
      .eq(0)
      .type(`{selectall}`)
      .get(hoveringToolbar)
      .should('exist')
      .should('have.css', 'opacity', '1')
      .find('span.material-icons')
      .should('have.length', 3)
  })
  it('hovering toolbar disappears', () => {
    cy.get('span[data-slate-string="true"]')
      .eq(0)
      .type(`{selectall}`)
      .get(hoveringToolbar)
      .should('exist')
      .get('span[data-slate-string="true"]')
      .eq(0)
      .type(`{selectall}`)
      .get('div')
      .eq(0)
      .click({ force: true })
      .get(hoveringToolbar)
      .should('have.css', 'opacity', '0')
  })
})
