import React from 'react'
export function VillainLife({ life }) {
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
