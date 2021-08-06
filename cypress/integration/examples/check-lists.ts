describe('Check-lists example', () => {
  beforeEach(() => {
    cy.visit('examples/check-lists')
  })

  it('checks the bullet when clicked', () => {
    const slateNodeElement = 'div[data-slate-node="element"]'

    cy.get(slateNodeElement).should('have.length', 6)

    cy.get(slateNodeElement)
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(1)
      .should('have.css', 'text-decoration-line', 'line-through')

    // Unchecking the checkboxes should un-cross the corresponding text.
    cy.get(slateNodeElement)
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(0)
      .find('input')
      .uncheck()
      .get(slateNodeElement)
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(1)
      .should('have.css', 'text-decoration-line', 'none')

    cy.get('p[data-slate-node="element"]').should('have.length', 2)
  })
})
