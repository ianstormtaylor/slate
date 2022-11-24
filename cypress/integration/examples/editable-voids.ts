describe('editable voids', () => {
  const input = 'input[type="text"]'
  const elements = [
    { tag: 'h4', count: 3 },
    { tag: input, count: 1 },
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

  it('make sure you can edit editable void', () => {
    cy.get(input).type('Typing')
    cy.get(input).should('have.value', 'Typing')
  })
})
