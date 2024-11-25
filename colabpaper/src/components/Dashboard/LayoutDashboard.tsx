import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const LayoutDashboard = ({ children }: LayoutProps) => {
  return (
    <div
      className="flex h-full bg-base-100"
      style={{ border: '1px solid red' }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <main
          className="flex-1 overflow-x-hidden overflow-y-hidden bg-dashboard"
          style={{ border: '5px solid blue' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default LayoutDashboard
