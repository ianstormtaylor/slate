import { useRef } from 'react'
import { ReactEditor } from '../plugin/react-editor'

// Uninitialized value is an object so that no value a user could pass in can === it
const UNINITIALIZED = {}
// This helper function is required to help typescript track the type of ref.current below
const isUninitialized = (v: unknown): v is typeof UNINITIALIZED =>
  v === UNINITIALIZED

export const useStable = <T>(init: () => T): T => {
  const ref = useRef<T | typeof UNINITIALIZED>(UNINITIALIZED)
  // If the ref hasn't been initialized, initialize it; else don't. then return the initialized value
  // This is written as a single expression to help typescript understand what's going on.
  return isUninitialized(ref.current) ? (ref.current = init()) : ref.current
}
