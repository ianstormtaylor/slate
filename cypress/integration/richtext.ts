describe('On richtext example', () => {
  beforeEach(() => cy.visit('examples/richtext'))

  it('renders rich text', () => {
    cy.findByRole('textbox')
      .get('strong')
      .should('contain.text', 'rich')
      .get('blockquote')
      .should('contain.text', 'wise quote')
  })

  it('inserts text when typed', () => {
    cy.findByRole('textbox')
      .type('{movetostart}')
      .type('Hello World')
      .should('contain.text', 'Hello World')
  })
})
