import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app'
import './index.css'

/**
 * Mount the router.
 */

const root = window.document.createElement('div')
root.id = 'root'
window.document.body.appendChild(root)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  )
}

render(App)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./app', () => render(App))
}
