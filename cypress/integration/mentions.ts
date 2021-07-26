describe('mentions example', () => {
  beforeEach(() => cy.visit('examples/mentions'))

  it('renders mention element', () => {
    cy.findByRole('textbox')
      .dataCy('mention-R2-D2')
      .should('exist')
      .dataCy('mention-Mace-Windu')
      .should('exist')
  })

  it('shows list of mentions', () => {
    cy.findByRole('textbox')
      .type('{movetoend}')
      .type(' @ma')
      .dataCy('mentions-portal')
      .should('exist')
  })

  it('inserts on enter from list', () => {
    cy.findByRole('textbox')
      .type('{movetoend}')
      .type(' @Ja')
      .type('{enter}')
      .dataCy('mention-Jabba')
      .should('exist')
  })
})
