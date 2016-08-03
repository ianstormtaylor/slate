# IFrame rendering example

This example shows how to render Slate into IFrame, preserving single react component tree.
You may need this if you want to have separate styles for editor content & application.

In example this exmaple you can see, 
that editor is using bootstrap styles, while they are not included to parent page. 

## React onSelect problem
Current react version has a problem with onSelect event handling, if input is rendered from parent component tree to iframe.

This problem is solved by custom SelectEventPlugin - [react-frame-aware-selection-plugin](https://www.npmjs.com/package/react-frame-aware-selection-plugin)

Check out the [Examples readme](..) to see how to run it!
