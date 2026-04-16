/// <reference types="bun-types/test-globals" />

declare var mock: typeof import('bun:test').mock
declare var spyOn: typeof import('bun:test').spyOn
declare var jest: {
  fn: typeof import('bun:test').mock
  spyOn: typeof import('bun:test').spyOn
}

declare module 'bun:test' {
  interface Mock<T extends (...args: any[]) => any = any> {
    mock: { calls: any[]; results: any[]; instances: any[] }
    mockClear(): void
    mockReset(): void
    mockRestore(): void
    mockImplementation(fn: T): this
    mockReturnValue(value: any): this
    mockReturnValueOnce(value: any): this
  }

  interface Spy extends Mock {}
}
