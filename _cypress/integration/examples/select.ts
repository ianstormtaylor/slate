describe('selection', () => {
  // Currently, testing color property always yields rgb() value, even when stored
  // as hex.
  // Hence, we'll overwrite Cypress `should` command, in which we use
  // `getComputedStyle` on both the subject element and creates a temp element
  // to get the computed color and compares.
  // Code by Nicholas Boll at https://github.com/cypress-io/cypress/issues/2186
  // 2021/08/27
  type CssStyleObject = Partial<CSSStyleDeclaration> &
    Record<string, string | null>
  const compareColor = (color: string, property: string) => (
    targetElement: NodeListOf<Element>
  ) => {
    const tempElement = document.createElement('div')
    tempElement.style.color = color
    tempElement.style.display = 'none' // make sure it doesn't actually render
    document.body.appendChild(tempElement) // append so that `getComputedStyle` actually works

    const tempColor = getComputedStyle(tempElement).color
    // Calling window.getComputedStyle(element) returns `CSSStyleDeclaration`
    // object which has numeric index signature with string keys.
    // We need to declare a new object which retains the typings of
    // CSSStyleDeclaration and yet is relaxed enough to accept an
    // arbitrary property name.

    const targetStyle = getComputedStyle(targetElement[0]) as CssStyleObject
    const targetColor = targetStyle[property]

    document.body.removeChild(tempElement) // remove it because we're done with it

    expect(tempColor).to.equal(targetColor)
  }
  Cypress.Commands.overwrite(
    'should',
    (originalFn, subject, expectation, ...args) => {
      const customMatchers: { [key: string]: any } = {
        'have.backgroundColor': compareColor(args[0], 'backgroundColor'),
        'have.color': compareColor(args[0], 'color'),
      }

      // See if the expectation is a string and if it is a member of Jest's expect
      if (typeof expectation === 'string' && customMatchers[expectation]) {
        return originalFn(subject, customMatchers[expectation])
      }
      return originalFn(subject, expectation, ...args)
    }
  )
  const slateEditor = '[data-slate-node="element"]'
  beforeEach(() => cy.visit('examples/richtext'))
  it('select the correct block when triple clicking', () => {
    // triple clicking the second block (paragraph) shouldn't highlight the
    // quote button
    for (let i = 0; i < 3; i++) {
      cy.get(slateEditor)
        .eq(1)
        .click()
    }
    cy.contains('.material-icons', /format_quote/)
      .parent()
      .should('have.color', '#ccc')
  })
})
