# Scrubber API

When Slate throws an exception, it includes a stringified representation of the
relevant data. For example, if your application makes an API call to access the
child of a text Node (an impossible operation), Slate will throw an exception
like this:

```
Cannot get the child of a text node: {"text": "This is my text node."}
```

If your rich text editor can include sensitive customer data, you may want to
scrub or obfuscate that text. To help with that, you can use the Scrubber API.
Here's an example of recursively scrubbing the `'text'` fields of any entity
that gets logged.

```typescript
import { Scrubber } from 'slate'

Scrubber.setScrubber((key, value) => {
  if (key === 'text') return '... scrubbed ...'
  return value
})
```

By setting the scrubber in this way, the error example given above will be
printed as

```
Cannot get the child of a text node: {"text": "... scrubbed ..."}
```

## Text Randomizer Example

Here's an example "textRandomizer" scrubber, which randomizes particular fields
of Nodes, preserving their length, but replacing their contents with randomly
chosen alphanumeric characters.

```typescript
import { Scrubber } from 'slate'

const textRandomizer = (fieldNames: string[]) => (key, value) => {
  if (fieldNames.includes(key)) {
    if (typeof value === 'string') {
      return value.split('').map(generateRandomCharacter).join('')
    } else {
      return '... scrubbed ...'
    }
  }

  return value
}

const generateRandomCharacter = (): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ1234567890'
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

// randomize the 'text' and 'src' fields of any Node that is included in an
// exception thrown by Slate
Scrubber.setScrubber(Scrubber.textRandomizer(['text', 'src']))
```

In this example, a Node that looked like

```json
{ "text": "My test input string", "count": 5 }
```

will be logged by Slate in an exception as (the random string will differ):

```json
{ "text": "rSIvEzKe39l6rqQSCfyv", "count": 5 }
```
