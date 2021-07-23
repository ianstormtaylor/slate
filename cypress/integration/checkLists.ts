describe('Check-lists example', () => {
  it('checks the bullet when clicked', () => {
    cy.visit('examples/check-lists')

    const slateNodeElement = 'div[data-slate-node="element"]'

    cy.get(slateNodeElement).should('have.length', 6)

    cy.get('div[data-slate-node="element"]')
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(1)
      .should('have.css', 'text-decoration-line', 'line-through')

    // uncheck the checkbox and then test if text is not crossed.
    cy.get('div[data-slate-node="element"]')
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(0)
      .find('input')
      .uncheck()
      .get('div[data-slate-node="element"]')
      .eq(3)
      .should('contain', 'Criss-cross!')
      .find('span')
      .eq(1)
      .should('have.css', 'text-decoration-line', 'none')

    cy.get('p[data-slate-node="element"]').should('have.length', 2)
  })
})
