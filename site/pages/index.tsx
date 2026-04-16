import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/examples')
  })

  return null
}

export default Home
