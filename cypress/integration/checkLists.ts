describe('On check-lists example', () => {
  it('checks the bullet when clicked', () => {
    cy.visit('examples/check-lists')

    cy.get('div[data-slate-node="element"]').should('have.length', 6)
    cy.get('p[data-slate-node="element"]').should('have.length', 2)
  })
})
