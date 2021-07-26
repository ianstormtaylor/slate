describe('table example', () => {
  beforeEach(() => {
    cy.visit('examples/tables')
  })

  it('table tag rendered', () => {
    cy.findByRole('textbox')
      .get('table')
      .should('exist')
  })
})
