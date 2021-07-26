describe('search highlighting', () => {
  beforeEach(() => cy.visit('examples/search-highlighting'))

  it('highlights the searched text', () => {
    const searchField = 'input[type="search"]'

    cy.get(searchField).type('text')
    cy.dataCy('search-highlighted').should('have.length', 2)
  })
})
