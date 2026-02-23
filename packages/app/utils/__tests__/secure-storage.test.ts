import { describe, it, expect } from 'vitest'
import { setItemAsync } from 'expo-secure-store'
import {
  storeCredentials,
  getCredentials,
  clearCredentials
} from '../secure-storage.native'

describe('secure-storage (native)', () => {
  it('stores and retrieves credentials', async () => {
    await storeCredentials('user@example.com', 's3cret')
    const creds = await getCredentials()
    expect(creds).toEqual({ email: 'user@example.com', password: 's3cret' })
  })

  it('returns null when no credentials stored', async () => {
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })

  it('clears stored credentials', async () => {
    await storeCredentials('user@example.com', 's3cret')
    await clearCredentials()
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })

  it('returns null on corrupted JSON', async () => {
    await setItemAsync('user_credentials', '{not valid json')
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })
})
