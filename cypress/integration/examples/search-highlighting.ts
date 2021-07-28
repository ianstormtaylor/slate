describe('search highlighting', () => {
  before(() => cy.visit('examples/search-highlighting'))
  afterEach(() => cy.reload())

  it('highlights the searched text', () => {
    const searchField = 'input[type="search"]'
    const highlightedText = 'search-highlighted'

    cy.get(searchField).type('text')
    cy.dataCy(highlightedText).should('have.length', 2)
  })
})
