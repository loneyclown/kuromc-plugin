import React from 'react'
import Footer from './footer'

export type PropsType = {
  children: React.ReactNode
}

export default function App({ children }: PropsType) {
  return (
    <>
      <div className="kuromc-container kuromc-bg-img relative p-10 pb-[72px]">
        {children}

        <Footer />
      </div>
    </>
  )
}
