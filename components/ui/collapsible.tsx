"use client"

import * as React from "react"

interface CollapsibleContextType {
  isOpen: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null)

export const Collapsible = ({ children, className, asChild }: {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const toggle = () => setIsOpen(!isOpen)
  
  const contextValue = { isOpen, toggle }

  if (asChild && React.isValidElement(children)) {
    return (
      <CollapsibleContext.Provider value={contextValue}>
        {React.cloneElement(children, { className })}
      </CollapsibleContext.Provider>
    )
  }

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div className={className} data-state={isOpen ? 'open' : 'closed'}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export const CollapsibleTrigger = ({ children, className, ...props }: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) => {
  const context = React.useContext(CollapsibleContext)
  if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible')
  
  return (
    <button 
      {...props}
      className={className}
      onClick={context.toggle}
      data-state={context.isOpen ? 'open' : 'closed'}
    >
      {children}
    </button>
  )
}

export const CollapsibleContent = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => {
  const context = React.useContext(CollapsibleContext)
  if (!context) throw new Error('CollapsibleContent must be used within Collapsible')
  
  if (!context.isOpen) return null
  
  return (
    <div className={className} data-state="open">
      {children}
    </div>
  )
}