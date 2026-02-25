import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock React hooks
let mockIsOpen = false
let mockData: unknown = null
const mockSetIsOpen = vi.fn((val: boolean | ((prev: boolean) => boolean)) => {
  if (typeof val === 'function') {
    mockIsOpen = val(mockIsOpen)
  } else {
    mockIsOpen = val
  }
})
const mockSetData = vi.fn((val: unknown) => {
  mockData = val
})

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')
  return {
    ...actual,
    useState: (initial: unknown) => {
      if (initial === false) {
        return [mockIsOpen, mockSetIsOpen]
      }
      return [mockData, mockSetData]
    },
    useCallback: (fn: unknown) => fn
  }
})

import { useModal } from '../useModal'

describe('useModal', () => {
  beforeEach(() => {
    mockIsOpen = false
    mockData = null
    mockSetIsOpen.mockClear()
    mockSetData.mockClear()
  })

  it('starts closed with no data', () => {
    const modal = useModal<{ id: number }>()
    expect(modal.isOpen).toBe(false)
    expect(modal.data).toBeNull()
  })

  it('opens with data', () => {
    const modal = useModal<{ id: number }>()
    modal.open({ id: 42 })
    expect(mockSetData).toHaveBeenCalledWith({ id: 42 })
    expect(mockSetIsOpen).toHaveBeenCalledWith(true)
  })

  it('closes and clears data', () => {
    mockIsOpen = true
    mockData = { id: 42 }
    const modal = useModal<{ id: number }>()
    modal.close()
    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
    expect(mockSetData).toHaveBeenCalledWith(null)
  })

  it('toggle flips isOpen', () => {
    const modal = useModal()
    modal.toggle()
    // The toggle calls setIsOpen with a function
    expect(mockSetIsOpen).toHaveBeenCalled()
    const toggleFn = mockSetIsOpen.mock.calls[0]?.[0]
    if (typeof toggleFn === 'function') {
      expect(toggleFn(false)).toBe(true)
      expect(toggleFn(true)).toBe(false)
    }
  })
})
