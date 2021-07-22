describe('search highlighting', () => {
  it('text searched is highlighted', () => {
    cy.visit('examples/search-highlighting')
    cy.get('input[type="search"]').type('text')
    cy.get('[data-cy="search-highlighted"]').should('have.length', 2)
  })
})
