import { mount } from '@cypress/react'
import Editor from './custom-placeholder'

describe('placeholder example', () => {
  beforeEach(() => mount(<Editor />))

  it('renders custom placeholder', () => {
    const placeholderElement = cy.get('[data-slate-placeholder=true]')

    placeholderElement
      .should('contain.text', 'Type something')
      .get('pre')
      .should('contain.text', 'renderPlaceholder')
  })
})
