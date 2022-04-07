import { mount } from '@cypress/react'
import Editor from './inlines'

describe('Inlines example', () => {
  beforeEach(() => {
    mount(<Editor />)
  })

  it('contains link', () => {
    cy.get('div[role="textbox"]')
      .find('a')
      .should('contain.text', 'hyperlink')
  })
})
