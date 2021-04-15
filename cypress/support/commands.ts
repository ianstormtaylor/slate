import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      goTo(uri: string): void
    }
  }
}

Cypress.Commands.add('goTo', (uri: string) => {
  cy.visit(`${Cypress.env('SITE_URL')}/${uri}`)
})

export {}
