import { mount } from '@cypress/react'
import React from 'react'
import Editor from './editable-voids'

describe('editable voids', () => {
  const elements = [
    { tag: 'h4', count: 3 },
    { tag: 'input[type="text"]', count: 1 },
    { tag: 'input[type="radio"]', count: 2 },
  ]

  beforeEach(() => {
    mount(<Editor />)
  })

  it('checks for the elements', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })

  it('should double the elements', () => {
    // click the `+` sign to duplicate the editable void
    cy.get('[data-testid="add-editable-void-button"]')
      .click()
      .then(() => {
        elements.forEach(({ tag, count }) => {
          cy.get(tag).should('have.length', count * 2)
        })
      })
  })
})
