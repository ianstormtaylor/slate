describe('search highlighting', () => {
  beforeEach(() => cy.visit('examples/search-highlighting'))

  it('highlights the searched text', () => {
    cy.get('input[type="search"]').type('text')
    cy.get('[data-cy="search-highlighted"]').should('have.length', 2)
  })
})
