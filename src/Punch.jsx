import React, { useRef, useEffect } from 'react'
export function Punch({ villainRef, children, onMiss, onHit }) {
  const ref = useRef()

  useEffect(
    () => {
      const intervalId = setInterval(() => {
        const { top, left, width, height } = ref.current.getBoundingClientRect()
        const {
          top: villainTop,
          left: villainLeft,
          width: villainWidth,
          height: villainHeight,
        } = villainRef.current.getBoundingClientRect()
        if (
          ((top >= villainTop && top - villainTop < villainHeight) ||
            (top < villainTop && villainTop - top < height)) &&
          ((left >= villainLeft && left - villainLeft < villainWidth) ||
            (left < villainLeft && villainLeft - left < width))
        ) {
          onHit()
        }
        if (top < 0) {
          onMiss()
        }
      }, 10)
      return () => clearInterval(intervalId)
    },
    [onMiss, onHit, villainRef]
  )

  return (
    <span ref={ref} className="punch">
      {children}
    </span>
  )
}
