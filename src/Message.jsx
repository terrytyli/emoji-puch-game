import React from 'react'
export function Message({ isNewRecord, seconds, onRestart }) {
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
