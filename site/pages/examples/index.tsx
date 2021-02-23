import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Example = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/examples/richtext`)
  })

  return null
}

export default Example
