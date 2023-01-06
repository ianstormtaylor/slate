import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add('dataCy', value => cy.get(`[data-cy="${value}"]`))
