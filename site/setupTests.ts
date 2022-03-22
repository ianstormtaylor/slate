import '@testing-library/jest-dom'

// Stub things Slate uses under the hood that JSDOM doesn't provide
// @ts-ignore Stubbing so we expect undefined
window.DataTransfer = class DataTransfer {}
// @ts-ignore Stubbing so we expect undefined
window.InputEvent.prototype.getTargetRanges = () => []
