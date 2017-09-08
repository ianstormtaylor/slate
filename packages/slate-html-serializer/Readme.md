
# `slate-html-serializer`

This package offers a simple way to serialize and deserialize Slate documents with an HTML schema of your choosing.

It doesn't hardcode any information about the schema itself (like which tag means "bold"), but allows you to build up a simple HTML serializer for your own use case.

It handles all of the heavy lifting of actually parsing the HTML, and iterating over the elements, and all you have to supply it is a `serialize()` and `deserialize()` function for each type of Node or Mark you want it to handle.

If called with `{render: false}` as the optional second argument, the serializer will return an iterable list of the top-level React elements generated, instead of automatically rendering these to a markup string.
