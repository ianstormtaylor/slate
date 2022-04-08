import { mount } from '@cypress/react'
import React from 'react'
import Editor from './embeds'

describe('embeds example', () => {
  const slateEditor = 'div[data-slate-editor="true"]'

  beforeEach(() => {
    mount(<Editor />)
  })

  it('contains embeded', () => {
    cy.get(slateEditor)
      .find('iframe')
      .should('exist')
      .should('have.length', 1)
  })
})
