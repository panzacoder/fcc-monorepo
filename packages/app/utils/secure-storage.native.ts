import * as SecureStore from 'expo-secure-store'

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
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials))
}

export async function getCredentials(): Promise<StoredCredentials | null> {
  try {
    const value = await SecureStore.getItemAsync(CREDENTIALS_KEY)
    if (!value) return null
    return JSON.parse(value) as StoredCredentials
  } catch {
    return null
  }
}

export async function clearCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(CREDENTIALS_KEY)
}
