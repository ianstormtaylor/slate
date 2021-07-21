describe('mentions example', () => {
  before(() => cy.visit('examples/mentions'))

  it('renders mention element', () => {
    cy.findByRole('textbox')
      .get('[data-cy=mention-R2-D2')
      .should('exist')
      .get('[data-cy=mention-Mace-Windu]')
      .should('exist')
  })

  it('shows list of mentions', () => {
    cy.findByRole('textbox')
      .type('{movetoend}')
      .type(' @ma')
      .get('[data-cy=mentions-portal]')
      .should('exist')
  })

  it('insert on enter from list', () => {
    cy.findByRole('textbox')
      .type('{movetoend}')
      .type(' @Ja')
      .type('{enter}')
      .get('[data-cy=mention-Jabba]')
      .should('exist')
  })
})
