import { mount } from '@cypress/react'
import Editor from './forced-layout'

describe('forced layout example', () => {
  const elements = [
    { tag: 'h2', count: 1 },
    { tag: 'p', count: 1 },
  ]

  beforeEach(() => {
    mount(<Editor />)
  })

  it('checks for the elements', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })

  it('checks if elements persist even after everything is deleted', () => {
    // clear the textbox
    cy.get('[role="textbox"]')
      .type(`{selectall}`)
      .clear().then(() => {
        elements.forEach(({ tag, count }) => {
          cy.get(tag).should('have.length', count)
        })
      })


  })
})
