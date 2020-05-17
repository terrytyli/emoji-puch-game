import React, { useCallback, useRef, useState } from 'react'
import { FistLeft, FistRight } from './Fist'
import { Message } from './Message'
import { Punch } from './Punch'
import { soundPlayer } from './sound-play'
import './styles.css'
import { Villain } from './Villain'
import { VillainLife } from './VillainLife'
import { isTouchDevice } from './utils'

export default function App() {
  const villainRef = useRef()
  const ringRef = useRef()
  const [leftPunches, setLeftPunches] = useState([])
  const [rightPunches, setRightPunches] = useState([])
  const [villainLife, setVillainLife] = useState(100)

  const [startTime, setStartTime] = useState(Date.now())
  const [endTime, setEndTime] = useState()

  const [messageVisible, setMessageVisible] = useState()
  const [isNewRecord, setIsNewRecord] = useState()
  const [record, setRecord] = useState(() => {
    const record = localStorage.getItem('record')
    return record ? Number(record) : undefined
  })

  const punchLeft = useCallback(
    () => {
      if (villainLife > 0) {
        const id = Date.now()
        const updated = [...leftPunches, { id }]
        soundPlayer.play('whoosh')
        setLeftPunches(updated)
      }
    },
    [leftPunches, villainLife]
  )

  const punchRight = useCallback(
    () => {
      if (villainLife > 0) {
        const id = Date.now()
        soundPlayer.play('whoosh')
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
        const updated = villainLife - 2
        setVillainLife(updated)
        soundPlayer.play('hit')
        if (updated === 0) {
          let et = Date.now()
          setEndTime(et)
          const lapse = et - startTime
          if (!record || lapse < record) {
            setIsNewRecord(true)
            setRecord(lapse)
            localStorage.setItem('record', lapse)
          } else {
            setIsNewRecord(false)
          }
          setTimeout(() => {
            setMessageVisible(true)
            soundPlayer.play('win')
          }, 1000)
        }
      }
    },
    [villainLife, setMessageVisible, startTime, record]
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
  }

  return (
    <div className="ring" ref={ringRef}>
      <VillainLife life={villainLife} />
      <Villain ref={villainRef} life={villainLife} ringRef={ringRef} />

      {messageVisible && (
        <Message
          isNewRecord={isNewRecord}
          seconds={((endTime - startTime) / 1000).toFixed(1)}
          onRestart={restart}
        />
      )}

      <div className="fists">
        <button
          onTouchStart={isTouchDevice && punchLeft}
          onClick={!isTouchDevice && punchLeft}
          className="fist"
        >
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

        <button
          onTouchStart={isTouchDevice && punchRight}
          onClick={!isTouchDevice && punchRight}
          className="fist"
        >
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
