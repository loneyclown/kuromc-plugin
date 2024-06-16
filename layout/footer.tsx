import React from 'react'
import util from '../models/util'

export type PropsType = {}

export default function App() {
  return (
    <>
      <footer
        style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
        className="text-gray-300 py-6"
      >
        <div className="text-center">
          <p>
            create by <span className="kuromc-text-title">kuromc-plugin</span> v
            <span className="italic">{util.version}</span>
          </p>
        </div>
      </footer>
    </>
  )
}
