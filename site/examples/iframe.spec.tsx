import { mount } from '@cypress/react'
import Editor from './iframe'

// Taken from https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () => {
  return cy
    .get('iframe')
    .its('0.contentDocument')
    .should('exist')
}

const getIframeBody = () => {
  return (
    getIframeDocument()
      .its('body')
      // automatically retries until body is loaded
      .should('not.be.undefined')
      .should('not.be.null')
      .then(cy.wrap)
  )
}

describe('iframe editor', () => {
  beforeEach(() => {
    mount(<Editor />)
  })

  it.only('should be editable', () => {
    getIframeBody().find('[role="textbox"]')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
