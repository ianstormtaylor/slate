# FAQ

A series of common questions people have about Slate:

- [Why is content pasted as plain text?](faq.md#why-is-content-is-pasted-as-plaintext)
- [What can a `Block` node have as its children?](faq.md#what-can-a-block-node-have-as-its-children)
- [What browsers and devices does Slate support?](faq.md#what-browsers-and-devices-does-slate-support)

## Why is content pasted as plain text?

One of Slate's core principles is that, unlike most other editors, it does **not** prescribe a specific "schema" to the content you are editing. This means that Slate's core has no concept of "block quotes" or "bold formatting".

For the most part, this leads to increased flexbility without many downsides, but there are certain cases where you have to do a bit more work. Pasting is one of those cases.

Since Slate knows nothing about your domain, it can't know how to parse pasted HTML content \(or other content\). So, by default whenever a user pastes content into a Slate editor, it will parse it as plain text. If you want it to be smarter about pasted content, you need to override the `insert_data` command and deserialize the `DataTransfer` object's `text/html` data as you wish.

## What browsers and devices does Slate support?

Slate's goal is to support all the modern browsers on both desktop and mobile devices.

However, right now Slate is in beta and is community-driven, so its support is not as robust as it could be. It's currently tested against the latest few versions of Chrome, Edge, Firefox and Safari on desktops. And it does not work in Internet Explorer. On mobile, iOS devices are supported but not regularly tested. Chrome on Android is supported on Slate 0.47 but is not currently supported in Slate 0.50+ though there is currently work being done on one \([https://github.com/ianstormtaylor/slate/issues/3786](https://github.com/ianstormtaylor/slate/issues/3786)\). If you want to add more browser or device support, we'd love for you to submit a pull request! Or in the case of incompatible browsers, build a plugin.

For older browsers, such as IE11, a lot of the now standard native APIs aren't available. Slate's position on this is that it is up to the user to bring polyfills \(like [https://polyfill.io](https://polyfill.io)\) when needed for things like `el.closest`, etc. Otherwise we'd have to bundle and maintain lots of polyfills that others may not even need in the first place. For clarity, Slate makes no guarantees that it will work with older browsers, even with polyfills and at present, there are still unresolved issues with IE11.
