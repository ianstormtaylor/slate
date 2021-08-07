describe('huge document example', () => {
  const elements = [
    { tag: 'h1', count: 100 },
    { tag: 'p', count: 700 },
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
