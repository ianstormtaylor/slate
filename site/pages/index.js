import React from 'react'
import Link from 'next/link'

const A = React.forwardRef((props, ref) => {
  console.log(props)
  return <a ref={ref} {...props} />
})

const Home = () => (
  <div>
    <Link href="/">
      <a>link</a>
    </Link>
    <br />
    <Link href="/">
      <A>link</A>
    </Link>
  </div>
)

export default Home
