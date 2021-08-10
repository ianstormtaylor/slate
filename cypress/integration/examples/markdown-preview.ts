describe('markdown preview', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  const markdown = 'span[data-slate-string="true"]'

  beforeEach(() => {
    cy.visit('examples/markdown-preview')
  })

  it('checks for markdown', () => {
    cy.get(slateEditor)
      .find(markdown)
      .should('have.length', 9)

    cy.get(slateEditor)
      .type('{movetoend}{enter}## Try it out!{enter}')
      .find(markdown)
      .should('have.length', 10)
  })
})
