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
      .then(cy.wrap)
  )
}

describe('iframe editor', () => {
  beforeEach(() => {
    cy.visit('examples/iframe')
  })

  it('should be editable', () => {
    getIframeBody()
      .findByRole('textbox')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
