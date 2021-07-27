describe('readonly editor', () => {
  beforeEach(() => {
    cy.visit('examples/read-only')
  })

  it('should not be editable', () => {
    cy.get('[data-slate-editor="true"]')
      .should('not.have.attr', 'contentEditable', 'true')
      .should('not.have.attr', 'role', 'textbox')
      .click()
      .should('not.be.focused')
  })
})
