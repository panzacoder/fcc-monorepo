import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  onSessionExpired,
  emitSessionExpired,
  _clearListeners
} from '../auth-events'

describe('auth-events', () => {
  beforeEach(() => {
    _clearListeners()
  })

  it('calls subscriber on emit', () => {
    const handler = vi.fn()
    const unsubscribe = onSessionExpired(handler)
    emitSessionExpired()
    expect(handler).toHaveBeenCalledOnce()
    unsubscribe()
  })

  it('calls multiple subscribers', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const unsub1 = onSessionExpired(handler1)
    const unsub2 = onSessionExpired(handler2)
    emitSessionExpired()
    expect(handler1).toHaveBeenCalledOnce()
    expect(handler2).toHaveBeenCalledOnce()
    unsub1()
    unsub2()
  })

  it('stops delivery after unsubscribe', () => {
    const handler = vi.fn()
    const unsubscribe = onSessionExpired(handler)
    unsubscribe()
    emitSessionExpired()
    expect(handler).not.toHaveBeenCalled()
  })

  it('handles emit with no subscribers', () => {
    expect(() => emitSessionExpired()).not.toThrow()
  })
})
