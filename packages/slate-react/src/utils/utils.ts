import { Fragment } from 'slate'

namespace Utils {
  /**
   * Get the `Fragment` data from a `DataTransfer` object.
   */

  export const getFragmentData = (
    dataTransfer: DataTransfer
  ): Fragment | undefined => {
    const base64 = dataTransfer.getData('application/x-slate-fragment')

    if (base64) {
      const decoded = decodeURIComponent(window.atob(base64))
      const fragment = JSON.parse(decoded)
      return fragment
    }
  }

  /**
   * Get the `Fragment` data from a `DataTransfer` object.
   */

  export const setFragmentData = (
    dataTransfer: DataTransfer,
    fragment: Fragment
  ): void => {
    const string = JSON.stringify(fragment)
    const encoded = window.btoa(encodeURIComponent(string))
    dataTransfer.setData('application/x-slate-fragment', encoded)
  }
}

export { Utils }
