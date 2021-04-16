describe('On richtext example', () => {
  it('inserts text when typed', () => {
    cy.visit('examples/richtext')

    cy.findByRole('textbox')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
