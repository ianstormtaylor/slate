import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, expect, vi } from 'vitest'

expect.extend(matchers)

Object.defineProperty(globalThis, 'React', {
  configurable: true,
  value: React,
  writable: true,
})

Object.assign(globalThis, {
  jest: {
    fn: vi.fn,
    spyOn: vi.spyOn,
  },
  mock: vi.fn,
  spyOn: vi.spyOn,
})

afterEach(() => {
  cleanup()
})
