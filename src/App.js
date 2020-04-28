import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from 'react'
import './styles.css'

function VillainLife({ life }) {
  return (
    <div className="villain-life">
      <span role="img" aria-label="avatar" className="avatar">
        🤖
      </span>
      <div className="life-bar">
        <div className="life-bar-life" style={{ width: `${life}%` }} />
      </div>
    </div>
  )
}

const Villain = forwardRef(({ ringRef, life, style }, ref) => {
  const [leftOffset, setLeftOffset] = useState()
  const [villainPunchLeft, setVillainPunchLeft] = useState()
  const [villainPunchRight, setVillainPunchRight] = useState()

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
    [ref]
  )

  return (
    <div
      ref={ref}
      className="villain"
      style={{
        transform: `translateX(${leftOffset}px)`,
        ...style,
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
            animation: villainPunchLeft && 'villain-punch 1.2s',
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
            animation: villainPunchRight && 'villain-punch 1.2s',
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
  )
})

function Punch({ villainRef, children, onMiss, onHit }) {
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

export default function App() {
  const villainRef = useRef()
  const ringRef = useRef()
  const [leftPunches, setLeftPunches] = useState([])
  const [rightPunches, setRightPunches] = useState([])
  const [villainLife, setVillainLife] = useState(100)

  const [startTime, setStartTime] = useState(Date.now())
  const [endTime, setEndTime] = useState()

  const [winMessageVisible, setWinMessageVisible] = useState()

  const punchLeft = useCallback(
    () => {
      if (villainLife > 0) {
        const id = Date.now()
        const updated = [...leftPunches, { id }]
        setLeftPunches(updated)
      }
    },
    [leftPunches, villainLife]
  )

  const punchRight = useCallback(
    () => {
      if (villainLife > 0) {
        const id = Date.now()
        setRightPunches([...rightPunches, { id }])
      }
    },
    [rightPunches, villainLife]
  )

  const removeLeftPunch = useCallback(
    (id) => {
      const updatedPunches = leftPunches.filter((lp) => {
        return lp.id !== id
      })
      setLeftPunches(updatedPunches)
    },
    [leftPunches]
  )

  const removeRightPunch = useCallback(
    (id) => {
      const updatedPunches = rightPunches.filter((lp) => {
        return lp.id !== id
      })
      setRightPunches(updatedPunches)
    },
    [rightPunches]
  )

  const handleHit = useCallback(
    () => {
      const updated = villainLife - 2
      setVillainLife(updated)
      if (updated <= 0) {
        setEndTime(Date.now())
        setTimeout(() => setWinMessageVisible(true), 300)
      }
    },
    [villainLife, setWinMessageVisible]
  )

  const handleHitLeftPunch = useCallback(
    (id) => {
      removeLeftPunch(id)
      handleHit()
    },
    [removeLeftPunch, handleHit]
  )

  const handleHitRightPunch = useCallback(
    (id) => {
      removeRightPunch(id)
      handleHit()
    },
    [removeRightPunch, handleHit]
  )

  function restart() {
    setVillainLife(100)
    setWinMessageVisible(false)
    setStartTime(Date.now())
    setEndTime(undefined)
  }

  return (
    <div className="ring" ref={ringRef}>
      <VillainLife life={villainLife} />
      <Villain
        ref={villainRef}
        life={villainLife}
        ringRef={ringRef}
        style={{
          visibility: winMessageVisible && 'hidden',
        }}
      />

      {winMessageVisible && (
        <div className="win">
          <div>
            <span role="img" aria-label="diamond">
              💎
            </span>
          </div>
          <div>YOU WIN!</div>
          <div>
            You made it in {((endTime - startTime) / 1000).toFixed(2)}
            s!
          </div>
          <button className="restart" onClick={restart}>
            Restart
          </button>
        </div>
      )}

      <div className="control">
        <div className="fists">
          <div>
            <button onClick={punchLeft} className="fist">
              {leftPunches.map((p) => {
                return (
                  <Punch
                    villainRef={villainRef}
                    key={p.id}
                    onMiss={() => removeLeftPunch(p.id)}
                    onHit={() => handleHitLeftPunch(p.id)}
                  >
                    <div className="fist-left">
                      <span role="img" aria-label="fist-left">
                        🤜
                      </span>
                    </div>
                  </Punch>
                )
              })}
              <div className="fist-left">
                <span role="img" aria-label="fist-left">
                  🤜
                </span>
              </div>
            </button>
          </div>

          <div>
            <button onClick={punchRight} className="fist">
              {rightPunches.map((p) => {
                return (
                  <Punch
                    key={p.id}
                    villainRef={villainRef}
                    onMiss={() => removeRightPunch(p.id)}
                    onHit={() => handleHitRightPunch(p.id)}
                  >
                    <div className="fist-right" key={p.id}>
                      <span role="img" aria-label="fist-right">
                        🤛
                      </span>
                    </div>
                  </Punch>
                )
              })}

              <div className="fist-right">
                <span role="img" aria-label="fist-right">
                  🤛
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
