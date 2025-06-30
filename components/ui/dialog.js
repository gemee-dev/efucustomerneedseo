import React, { createContext, useContext, useState } from "react"

const DialogContext = createContext()

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false)
  
  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }
  
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  const { setIsOpen } = useContext(DialogContext)
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: () => setIsOpen(true)
    })
  }
  
  return (
    <button {...props} onClick={() => setIsOpen(true)}>
      {children}
    </button>
  )
}

const DialogContent = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => setIsOpen(false)}
      />
      <div className={`relative bg-white rounded-lg shadow-lg ${className}`} {...props}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
)

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
