require('@testing-library/jest-dom')

// Stub things Slate uses under the hood that JSDOM doesn't provide
window.DataTransfer = class DataTransfer {}
window.InputEvent.prototype.getTargetRanges = () => []
