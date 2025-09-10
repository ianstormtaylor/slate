import React from 'react'

export function ComponentLoader() {
  return (
    <div className="loading-container loading-spinner">
      <div className="spinner" />
      <p className="loading-text">Loading example...</p>
    </div>
  )
}

export function HugeDocumentLoader() {
  return (
    <div className="loading-container huge-loader-container">
      <div className="spinner" />
      <h2 className="loading-text huge-title">Loading Huge Document</h2>
      <p className="loading-text huge-subtitle">
        Preparing thousands of nodes...
      </p>
    </div>
  )
}
