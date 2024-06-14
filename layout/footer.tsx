import React from 'react'
import util from '../models/util'

export type DataType = {
  name: string
}
export type PropsType = {}
export default function App() {
  return (
    <>
      <footer className="text-gray-300 py-6">
        <div className="container">
          <div className="text-center">
            <p>create by <span className='kuromc-text-title'>kuromc-plugin</span> v<span className='italic'>{util.version}</span> </p>
          </div>
        </div>
      </footer>
    </>
  )
}