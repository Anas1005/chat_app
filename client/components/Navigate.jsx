import {useRouter} from 'next/navigation'
import {useEffect} from 'react'


 const Navigate=({to, replace = false})=> {
  const router = useRouter()

  useEffect(() => {
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }, [replace, router, to])

  return null
}

export default Navigate;