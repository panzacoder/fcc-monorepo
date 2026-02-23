import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchData, ApiError } from '../base'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.mock('app/utils/device', () => ({
  getUserDeviceInformation: vi.fn().mockResolvedValue({
    buildNumber: 'test-build',
    ostype: 'ios',
    host: 'test-brand',
    osversion: '17.0',
    modelnumber: 'test-model',
    browser: 'test-browser',
    appclient: 'M'
  })
}))

vi.mock('app/utils/urlConstants', () => ({
  BASE_URL: 'https://api.example.com/'
}))

vi.mock('app/utils/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const mockEmitSessionExpired = vi.fn()
vi.mock('app/utils/auth-events', () => ({
  emitSessionExpired: (...args: unknown[]) => mockEmitSessionExpired(...args)
}))

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  })
}

describe('fetchData', () => {
  const header = { token: 'test-token' }

  beforeEach(() => {
    mockFetch.mockReset()
    mockEmitSessionExpired.mockReset()
  })

  it('returns typed data on SUCCESS', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({ status: 'SUCCESS', data: { id: 1, name: 'Test' } })
    )

    const result = await fetchData<{ id: number; name: string }>({
      header,
      route: 'test/endpoint',
      data: { query: 'value' }
    })

    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('constructs correct URL from BASE_URL + route', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({ header, route: 'users/list' })

    const calledUrl = mockFetch.mock.calls[0]![0]
    expect(calledUrl.toString()).toBe('https://api.example.com/users/list')
  })

  it('sends POST with JSON content-type and correct payload', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({
      header: { token: 'abc' },
      route: 'test',
      data: { foo: 'bar' }
    })

    const [, options] = mockFetch.mock.calls[0]!
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    const body = JSON.parse(options.body)
    expect(body.header.token).toBe('abc')
    expect(body.header.deviceInfo).toBeDefined()
    expect(body.foo).toBe('bar')
  })

  it.each([400, 401, 403, 500])('throws on HTTP %i', async (status) => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status }))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      `Request failed with status ${status}`
    )
  })

  it('throws on SEP_101 and emits session expired', async () => {
    mockFetch.mockReturnValue(jsonResponse({ errorCode: 'SEP_101' }))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      'Session expired'
    )
    expect(mockEmitSessionExpired).toHaveBeenCalledOnce()
  })

  it('throws ApiError with errorCode on business failure', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({
        status: 'FAILURE',
        message: 'Not found',
        errorCode: 'NF_404'
      })
    )

    try {
      await fetchData({ header, route: 'test' })
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('Not found')
      expect((err as ApiError).errorCode).toBe('NF_404')
    }
  })

  it('propagates network errors (does not swallow)', async () => {
    mockFetch.mockRejectedValue(new TypeError('Network request failed'))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      'Network request failed'
    )
  })

  it('uses default empty data when none provided', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({ header, route: 'test' })

    const body = JSON.parse(mockFetch.mock.calls[0]![1].body)
    expect(body.header).toBeDefined()
  })
})
