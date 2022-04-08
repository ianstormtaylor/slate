import { mount } from '@cypress/react'
import React from 'react'
import Editor from './search-highlighting'

describe('search highlighting', () => {
  beforeEach(() => mount(<Editor />))

  it('highlights the searched text', () => {
    const searchField = 'input[type="search"]'

    cy.get(searchField).type('text')
    cy.get('[data-cy=search-highlighted]').should('have.length', 2)
  })
})
