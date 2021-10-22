describe('Inlines example', () => {
  beforeEach(() => {
    cy.visit('examples/inlines')
  })

  it('contains link', () => {
    cy.findByRole('textbox')
      .find('a')
      .should('contain.text', 'hyperlinks')
  })
})
