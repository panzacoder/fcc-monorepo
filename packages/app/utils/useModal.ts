import { useState, useCallback } from 'react'

export interface ModalState<T> {
  isOpen: boolean
  data: T | null
  open: (data: T) => void
  close: () => void
  toggle: () => void
}

export function useModal<T = void>(): ModalState<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((d: T) => {
    setData(d)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, data, open, close, toggle }
}
