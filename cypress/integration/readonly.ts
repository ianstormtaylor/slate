describe('readonly editor', () => {
  it('should not be editable', () => {
    cy.visit('examples/read-only')
      .get('[data-slate-editor="true"]')
      .should('not.have.attr', 'contentEditable', 'true')
      .should('not.have.attr', 'role', 'textbox')
      .click()
      .should('not.be.focused')
  })
})
