describe('embeds example', () => {
  const slateEditor = 'div[data-slate-editor="true"]'

  beforeEach(() => {
    cy.visit('examples/embeds')
  })

  it('contains embeded', () => {
    cy.get(slateEditor)
      .find('iframe')
      .should('exist')
      .should('have.length', 1)
  })
})
