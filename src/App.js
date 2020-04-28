import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from 'react'
import './styles.css'

const Villain = forwardRef(({ ringRef, life }, ref) => {
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

function Message({ isNewRecord, seconds, onRestart }) {
  return (
    <div className="message">
      {isNewRecord && (
        <>
          <div>
            <span role="img" aria-label="trophy" className="trophy">
              🏆
            </span>
          </div>
          <div>New Record!</div>
        </>
      )}

      <div>
        You beat it in <i>{seconds}</i>
        {'  '} seconds!
      </div>
      <button className="restart" onClick={onRestart}>
        Restart
      </button>
    </div>
  )
}

function FistLeft() {
  return (
    <div className="fist-left">
      <span role="img" aria-label="fist-left">
        🤜
      </span>
    </div>
  )
}

function FistRight() {
  return (
    <div className="fist-right">
      <span role="img" aria-label="fist-right">
        🤛
      </span>
    </div>
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

  const [messageVisible, setMessageVisible] = useState()
  const [record, setRecord] = useState(0)

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
      if (villainLife > 0) {
        const updated = villainLife - 5
        setVillainLife(updated)
        if (updated === 0) {
          setEndTime(Date.now())
          setTimeout(() => setMessageVisible(true), 1000)
        }
      }
    },
    [villainLife, setMessageVisible]
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
    setMessageVisible(false)
    setStartTime(Date.now())
    setEndTime(undefined)
    setRecord(endTime - startTime)
  }

  return (
    <div className="ring" ref={ringRef}>
      <VillainLife life={villainLife} />
      <Villain ref={villainRef} life={villainLife} ringRef={ringRef} />

      {messageVisible && (
        <Message
          isNewRecord={!record || endTime - startTime < record}
          seconds={((endTime - startTime) / 1000).toFixed(1)}
          onRestart={restart}
        />
      )}

      <div className="fists">
        <button onClick={punchLeft} className="fist">
          {leftPunches.map((p) => {
            return (
              <Punch
                villainRef={villainRef}
                key={p.id}
                onMiss={() => removeLeftPunch(p.id)}
                onHit={() => handleHitLeftPunch(p.id)}
              >
                <FistLeft />
              </Punch>
            )
          })}

          <FistLeft />
        </button>

        <button onClick={punchRight} className="fist">
          {rightPunches.map((p) => {
            return (
              <Punch
                key={p.id}
                villainRef={villainRef}
                onMiss={() => removeRightPunch(p.id)}
                onHit={() => handleHitRightPunch(p.id)}
              >
                <FistRight />
              </Punch>
            )
          })}

          <FistRight />
        </button>
      </div>
    </div>
  )
}
