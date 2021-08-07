describe('images example', () => {
  beforeEach(() => {
    cy.visit('examples/images')
  })

  it('contains image', () => {
    cy.findByRole('textbox')
      .find('img')
      .should('exist')
      .should('have.length', 1)
  })
})
