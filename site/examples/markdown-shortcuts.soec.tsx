import { mount } from '@cypress/react'
import React from 'react'
import Editor from './markdown-shortcuts'

describe('On markdown-shortcuts example', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  beforeEach(() => {
    mount(<Editor />)
  })

  it('contains quote', () => {
    cy.get(slateEditor)
      .find('blockquote')
      .should('contain.text', 'A wise quote.')
  })

  it('can add list items', () => {
    cy.get(slateEditor)
      .find('ul')
      .should('not.exist')

    cy.get(slateEditor)
      // need wait() here otherwise the slate component is not fully mounted yet sometimes
      .wait(1000)
      .type(
        '{movetostart}* 1st Item{enter}2nd Item{enter}3rd Item{enter}{backspace}'
      )

    cy.get('ul > li')

    cy.get('ul > li').should('have.length', 3)

    cy.get('ul > li')
      .eq(0)
      .should('contain.text', '1st Item')
      .get('ul > li')
      .eq(1)
      .should('contain.text', '2nd Item')
      .get('ul > li')
      .eq(2)
      .should('contain.text', '3rd Item')
  })

  it('can add a h1 item', () => {
    cy.get(slateEditor)
      .find('h1')
      .should('not.exist')

    cy.get(slateEditor).type('{enter}{leftarrow}# Heading')

    cy.get('h1').should('have.length', 1)

    cy.get(slateEditor)
      .find('h1')
      .should('contain.text', 'Heading')
  })
})
