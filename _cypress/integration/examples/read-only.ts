describe('readonly editor', () => {
  beforeEach(() => {
    cy.visit('examples/read-only')
  })

  it('should not be editable', () => {
    const slateEditor = '[data-slate-editor="true"]'

    cy.get(slateEditor)
      .should('not.have.attr', 'contentEditable', 'true')
      .should('not.have.attr', 'role', 'textbox')
      .click()
      .should('not.be.focused')
  })
})
