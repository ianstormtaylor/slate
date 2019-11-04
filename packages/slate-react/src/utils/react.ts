import { SyntheticEvent } from 'react'

/**
 * Check if an event is a synthetic event.
 */

export const isSyntheticEvent = (value: any): value is SyntheticEvent => {
  return value && 'nativeEvent' in value
}
