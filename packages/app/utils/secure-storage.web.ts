const CREDENTIALS_KEY = 'user_credentials'

interface StoredCredentials {
  email: string
  password: string
}

export async function storeCredentials(
  email: string,
  password: string
): Promise<void> {
  const credentials: StoredCredentials = { email, password }
  try {
    sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
  } catch {
    // sessionStorage unavailable (SSR or private browsing)
  }
}

export async function getCredentials(): Promise<StoredCredentials | null> {
  try {
    const value = sessionStorage.getItem(CREDENTIALS_KEY)
    if (!value) return null
    return JSON.parse(value) as StoredCredentials
  } catch {
    return null
  }
}

export async function clearCredentials(): Promise<void> {
  try {
    sessionStorage.removeItem(CREDENTIALS_KEY)
  } catch {
    // sessionStorage unavailable
  }
}
