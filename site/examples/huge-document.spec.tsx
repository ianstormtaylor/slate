import { mount } from '@cypress/react'
import Editor from './huge-document'

describe('huge document example', () => {
  const elements = [
    { tag: 'h1', count: 100 },
    { tag: 'p', count: 700 },
  ]

  beforeEach(() => {
    mount(<Editor />)
  })

  it('contains image', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })
})
