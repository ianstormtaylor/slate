
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>

### Adding Custom Formatting

In the last guide we learned how to use Slate's event handlers to change its content, but we didn't do anything really that useful with it.

In this guide, we'll show you how to add custom formatting options, like **bold**, _italic_, `code` or ~~strikethrough~~.

So we start with our app from earlier, but we'll get rid of that useless `onKeyDown` handler logic, and we'll replace it with logic that will add a **bold** format to the currently selected text:

```js
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
        onKeyDown={e, state => this.onKeyDown(e, state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    // Return with no changes if it's not the "B" key with cmd/ctrl pressed.
    if (event.which != 66 || !event.metaKey) return

    // Otherwise, transform the state by adding a `bold` mark to the selection.
    const newState = state
      .transform()
      .mark('bold')
      .apply()
    
    // Return the new state, which will cause the editor to update it.
    return newState
  }

}
```

Now if you read through `onKeyDown`, it should be fairly clear. 

But! If you happen to now try selecting text and hitting **⌘-B**, you'll get an error in your console. That's because we haven't told Slate how to render a "bold" mark.

For every mark type you want to add to your schema, you need to give Slate a "renderer" for that mark, which is just an object of styles that will be passed to React's `style=` property.

So let's define our `bold` mark:


```js
// Define a set of styles that make text bold.
const BOLD_MARK = {
  fontWeight: 'bold'
}
```

Pretty simple, right?

And now, let's tell Slate about that mark. To do that, we'll need to pass in a `renderMark` function to the `Editor`, which it will call with any mark it finds. And when it calls it with a bold mark, we'll return our `BOLD_MARK` styles. Like so:

```js
const BOLD_MARK = {
  fontWeight: 'bold'
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
        onKeyDown={e, state => this.onKeyDown(e, state)}
        renderMark={mark => this.renderMark(mark)}
      />
    )
  }

  // Define a mark rendering function that knows about "bold" marks.
  renderMark(mark) {
    if (mark.type == 'bold') return BOLD_MARK
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    if (event.which != 66 || !event.metaKey) return

    const newState = state
      .transform()
      .mark('bold')
      .apply()
    
    return newState
  }

}
```

Now, if you try selecting a piece of text and hitting **⌘-B** you should see it turn bold! Magic!


<br/>
<p align="center"><strong>Next:</strong><br/><a href="./adding-custom-block-types.md">Adding Custom Block Types</a></p>
<br/>
