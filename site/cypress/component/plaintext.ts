describe('plaintext example', () => {
  beforeEach(() => cy.visit('examples/plaintext'))

  it('inserts text when typed', () => {
    cy.findByRole('textbox')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
