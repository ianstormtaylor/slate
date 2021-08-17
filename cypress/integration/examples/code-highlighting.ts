describe('code highlighting', () => {
  const slateEditor = '[data-slate-node="element"]'
  const leafNode = 'span[data-slate-leaf="true"]'

  beforeEach(() => {
    cy.visit('examples/code-highlighting')
  })

  it('highlights HTML tags', () => {
    cy.get(slateEditor)
      .find('span')
      .eq(0)
      .find(leafNode)
      .eq(0)
      .should('contain', '<h1>')
      .should('have.css', 'color', 'rgb(153, 0, 85)')
  })

  it(
    'highlights javascript syntax',
    {
      defaultCommandTimeout: 10000, // test was not passing within 4s default
    },
    () => {
      const JSCode = 'const slateVar = 30;{enter}'
      cy.get('select').select('JavaScript') // Select the 'JavaScript' option
      cy.get('select').should('have.value', 'js') // Confirm value to avoid race condition

      cy.get(slateEditor)
        .type('{movetostart}')
        .type(JSCode) // Type JavaScript code

      cy.get(slateEditor)
        .find('span')
        .eq(0)
        .find(leafNode)
        .eq(0)
        .should('contain', 'const')
        .should('have.css', 'color', 'rgb(0, 119, 170)')
    }
  )
})
