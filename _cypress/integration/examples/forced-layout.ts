describe('forced layout example', () => {
  const elements = [
    { tag: '#__next h2', count: 1 },
    { tag: '#__next p', count: 1 },
  ]

  beforeEach(() => {
    cy.visit('examples/forced-layout')
  })

  it('checks for the elements', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })

  it('checks if elements persist even after everything is deleted', () => {
    // clear the textbox
    cy.get('div[role="textbox"]')
      .type(`{selectall}`)
      .clear()

    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })
})
