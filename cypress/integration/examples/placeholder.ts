describe('placeholder example', () => {
  beforeEach(() => cy.visit('examples/custom-placeholder'))

  it('renders custom placeholder', () => {
    const placeholderElement = cy.get('[data-slate-placeholder=true]')

    placeholderElement
      .should('contain.text', 'Type something')
      .get('pre')
      .should('contain.text', 'renderPlaceholder')
  })
})
