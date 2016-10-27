
This directory contains the serializers that ship by default with Slate. They are not the only serializers, it's fairly easy to implement your own if you have more complex use cases. Here's what the core serializers do:

- [Html](#html)
- [Raw](#raw)

#### Html

The `Html` serializer offers a simple way to serialize and deserialize an HTML schema of your choosing.

It doesn't hardcode any information about the schema itself (like which tag means "bold"), but allows you to build up a simple HTML serializer for your own use case.

It handles all of the heavy lifting of actually parsing the HTML, and iterating over the elements, and all you have to supply it is a `serialize()` and `deserialize()` function for each type of [`Node`](../models#node) or [`Mark`](../models/#mark) you want it to handle.

If called with `{render: false}` as the optional second argument, the serializer will return an iterable list of the top-level React elements generated, instead of automatically rendering these to a markup string.


#### Raw

The `Raw` serializer is the simplest serializer, which translates a [`State`](../models#state) into JSON.

It doesn't just use Immutable.js's [`.toJSON()`](https://facebook.github.io/immutable-js/docs/#/List/toJS) method. Instead, it performs a little bit of "minifying" logic to reduce unnecessary information from being in the raw output.

It also transforms [`Text`](../models#text) nodes's content from being organized by [`Characters`](../models#character) into the concept of "ranges", which have a unique set of [`Marks`](../models#mark).
