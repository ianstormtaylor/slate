describe('editable voids', () => {
  const elements = [
    { tag: 'h4', count: 3 },
    { tag: 'input[type="text"]', count: 1 },
    { tag: 'input[type="radio"]', count: 2 },
  ]

  beforeEach(() => {
    cy.visit('examples/editable-voids')
  })

  it('checks for the elements', () => {
    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count)
    })
  })

  it('should double the elements', () => {
    // click the `+` sign to duplicate the editable void
    cy.get('span.material-icons')
      .eq(1)
      .click()

    elements.forEach(({ tag, count }) => {
      cy.get(tag).should('have.length', count * 2)
    })
  })
})
