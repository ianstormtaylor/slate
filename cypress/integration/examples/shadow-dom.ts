describe('shadow-dom example', () => {
  beforeEach(() => cy.visit('examples/shadow-dom'))

  it('renders slate editor inside nested shadow', () => {
    const outerShadow = cy.dataCy('outer-shadow-root').shadow()
    const innerShadow = outerShadow.find('> div').shadow()

    innerShadow.findByRole('textbox').should('exist')
  })
})
