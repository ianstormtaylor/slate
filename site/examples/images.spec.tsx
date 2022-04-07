import { mount } from '@cypress/react'
import Editor from './images'

describe('images example', () => {
  beforeEach(() => {
    mount(<Editor />)
  })

  it('contains image', () => {
    cy.get('div[role="textbox"]')
      .find('img')
      .should('exist')
      .should('have.length', 2)
  })
})
