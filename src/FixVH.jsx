import { useEffect } from 'react'

export function FixVH() {
  useEffect(() => {
    function setVH() {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVH()

    window.addEventListener('resize', setVH)

    return () => {
      window.removeEventListener('resize', setVH)
    }
  }, [])

  return null
}
