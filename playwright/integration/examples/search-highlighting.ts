describe('search highlighting', () => {
  beforeEach(() => cy.visit('examples/search-highlighting'))

  it('highlights the searched text', () => {
    const searchField = 'input[type="search"]'
    const highlightedText = 'search-highlighted'

    cy.get(searchField).type('text')
    cy.dataCy(highlightedText).should('have.length', 2)
  })
})
