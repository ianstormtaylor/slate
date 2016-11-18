
This directory contains the core schema that ships with Slate by default, which controls all of the "core" document and selection validation logic. For example, it ensures that two adjacent text nodes are always joined, or that the top-level document only ever contains block nodes. It is not exposed by default, since it is only needed internally.
