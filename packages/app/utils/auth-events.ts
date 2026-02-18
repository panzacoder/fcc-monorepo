type AuthEventHandler = () => void

const listeners: Set<AuthEventHandler> = new Set()

export function onSessionExpired(handler: AuthEventHandler): () => void {
  listeners.add(handler)
  return () => {
    listeners.delete(handler)
  }
}

export function emitSessionExpired(): void {
  listeners.forEach((handler) => handler())
}
