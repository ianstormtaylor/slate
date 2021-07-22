describe('table example', () => {
  it('table tag rendered', () => {
    cy.visit('examples/tables')

    cy.findByRole('textbox')
      .get('table')
      .should('exist')
  })
})
