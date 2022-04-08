import { mount } from '@cypress/react'
import React from 'react'
import Editor from './tables'

describe('table example', () => {
  beforeEach(() => {
    mount(<Editor />)
  })

  it('table tag rendered', () => {
    cy.get('[data-slate-editor="true"]')
      .get('table')
      .should('exist')
  })
})
