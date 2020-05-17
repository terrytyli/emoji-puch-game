import React, { forwardRef, useEffect, useState } from 'react'

export const Villain = forwardRef(({ ringRef, life }, ref) => {
  const [leftOffset, setLeftOffset] = useState()
  const [villainPunchLeft, setVillainPunchLeft] = useState()
  const [villainPunchRight, setVillainPunchRight] = useState()

  let lastLeftOffset

  if (life > 0) {
    lastLeftOffset = leftOffset
  }

  useEffect(
    () => {
      const movingIntervalId = setInterval(() => {
        const width =
          ringRef.current.getBoundingClientRect().width -
          ref.current.getBoundingClientRect().width

        setLeftOffset(Math.random() * width)
      }, 600)

      const leftPunchIntervalId = setInterval(() => {
        if (Math.random() > 0.5) {
          setVillainPunchLeft(true)
        } else {
          setVillainPunchLeft(false)
        }
      }, 1500)

      const rightPunchIntervalId = setInterval(() => {
        if (Math.random() > 0.5) {
          setVillainPunchRight(true)
        } else {
          setVillainPunchRight(false)
        }
      }, 1500)

      return () => {
        clearInterval(movingIntervalId)
        clearInterval(leftPunchIntervalId)
        clearInterval(rightPunchIntervalId)
      }
    },
    [ref, ringRef]
  )

  return (
    <div
      ref={ref}
      className="villain"
      style={{
        transform: `translateX(${life > 0 ? leftOffset : lastLeftOffset}px)`,
      }}
    >
      <div
        className="villain-inner"
        style={{
          animation: life === 0 && 'dead 1.5s ease-out forwards',
        }}
      >
        <div className="head">
          {life < 100 && <div className="flash" key={life} />}
          <span role="img" aria-label="head">
            🤖
          </span>
        </div>

        <div className="cogs">
          <div
            className="cog"
            style={{
              animation: life > 0 && villainPunchLeft && 'villain-punch 1.2s',
            }}
          >
            <div className="cog-left">
              <span role="img" aria-label="cog">
                ⚙
              </span>
            </div>
          </div>

          <div style={{ width: '2rem' }} />
          <div
            className="cog"
            style={{
              animation: life > 0 && villainPunchRight && 'villain-punch 1.2s',
            }}
          >
            <div className="cog cog-right">
              <span role="img" aria-label="cog">
                ⚙
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
