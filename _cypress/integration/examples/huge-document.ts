describe('huge document example', () => {
  const elements = [
    { tag: '#__next h1', count: 100 },
    { tag: '#__next p', count: 700 },
  ]

  beforeEach(() => {
    cy.visit('examples/huge-document')
  })

  it('contains image', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })
})
