import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Example = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/examples/richtext')
  })

  return null
}

export default Example
