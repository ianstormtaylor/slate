import React from 'react'
import ReactDOM from 'react-dom'

function resolveDocument (reactIFrameElementNode) {
    const iFrame = ReactDOM.findDOMNode(reactIFrameElementNode);
    return iFrame.contentDocument
}

//appending context to body > div, to suppress react warning
function getRootDiv (doc) {
    let rootDiv = doc.querySelector('div#root')
    if (!rootDiv) {
        rootDiv = doc.createElement('div')
        rootDiv.setAttribute('id', 'root')
        rootDiv.id = 'root'
        rootDiv.setAttribute('style', 'width: 100%; height: 100%')

        doc.body.appendChild(rootDiv)
    }
    return rootDiv
}

class IFrame extends React.Component {

    static propTypes = {
        head: React.PropTypes.node,
        children: React.PropTypes.node,
    }

    //rendering plain frame.
    render () {
        return <iframe style={{border: 'solid 1px black', width: '100%'}}></iframe>
    }

    componentDidMount = () => {
        this.renderContents()
    }

    componentDidUpdate = () => {
        this.renderContents()
    }

    componentWillUnmount = () => this.getDocument().then((doc) => {
        ReactDOM.unmountComponentAtNode(doc.body)
        if (this.props.head) {
            ReactDOM.unmountComponentAtNode(doc.head)
        }
    })

    renderContents = () => this.getDocument().then((doc) => {
        if (this.props.head) {
            ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.head, doc.head)
        }
        const rootDiv = getRootDiv(doc)
        ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.children, rootDiv)
    })


    getDocument = () => new Promise((resolve) => {
        const resolveTick = () => { //using arrow function to preserve `this` context
            let doc = resolveDocument(this)
            if (doc && doc.readyState === 'complete') {
                resolve(doc)
            } else {
                window.requestAnimationFrame(resolveTick)
            }
        }
        resolveTick()
    })

}

class IFrameRendering extends React.Component {

    render () {
        const bootstrapCDN =
            <link
                href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                crossOrigin="anonymous">
            </link>

        return (
            <IFrame head={bootstrapCDN}>
                <div>I'm in iframe</div>
            </IFrame>
        )
    }

}

export default IFrameRendering
