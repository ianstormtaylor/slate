import { mount } from '@cypress/react'
import React from 'react'
import Editor from './shadow-dom'

describe('shadow-dom example', () => {
  beforeEach(() => mount(<Editor />))

  it('renders slate editor inside nested shadow', () => {
    const outerShadow = cy.get('[data-cy=outer-shadow-root]').shadow()
    const innerShadow = outerShadow.find('> div').shadow()

    innerShadow.find('[role="textbox"]').should('exist')
  })
})
