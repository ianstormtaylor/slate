describe('Links example', () => {
  beforeEach(() => {
    cy.visit('examples/links')
  })

  it('contains link', () => {
    cy.findByRole('textbox')
      .find('a')
      .should('contain.text', 'hyperlinks')
  })
})
