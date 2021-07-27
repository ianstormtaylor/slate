describe('On markdown-shortcuts example', () => {
  beforeEach(() => {
    cy.visit('examples/markdown-shortcuts')
  })

  it('contains quote', () => {
    cy.findByRole('textbox')
      .find('blockquote')
      .should('contain.text', 'A wise quote.')
  })

  it('add list items', () => {
    cy.findByRole('textbox')
      .find('ul')
      .should('not.exist')

    cy.findByRole('textbox').type(
      '{movetostart}- 1st Item{enter}2nd Item{enter}3rd Item{enter}{backspace}'
    )

    cy.get('ul > li').should('have.length', 3)

    cy.get('ul > li')
      .eq(0)
      .should('contain.text', '1st Item')
      .get('ul > li')
      .eq(1)
      .should('contain.text', '2nd Item')
      .get('ul > li')
      .eq(2)
      .should('contain.text', '3rd Item')
  })

  it('add a h1 item', () => {
    cy.findByRole('textbox')
      .find('h1')
      .should('not.exist')

    cy.findByRole('textbox').type('{enter}{leftarrow}# Heading')

    cy.get('h1').should('have.length', 1)

    cy.findByRole('textbox')
      .find('h1')
      .should('contain.text', 'Heading')
  })
})
