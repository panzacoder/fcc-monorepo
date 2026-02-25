import { describe, it, expect, vi } from 'vitest'
import type { DomainPrivileges } from 'app/data/types.d'

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')
  return {
    ...actual,
    useMemo: (fn: () => unknown) => fn()
  }
})

import { usePermissions } from '../usePermissions'

describe('usePermissions', () => {
  it('returns empty array when domainObjectPrivileges is undefined', () => {
    const result = usePermissions(undefined, 'Appointment')
    expect(result).toEqual([])
  })

  it('returns permissions for a matching key', () => {
    const privileges: DomainPrivileges = {
      Appointment: ['Read', 'Create']
    }
    const result = usePermissions(privileges, 'Appointment')
    expect(result).toEqual(['Read', 'Create'])
  })

  it('tries keys in order and returns first match', () => {
    const privileges: DomainPrivileges = {
      IncidentNote: ['Read']
    }
    const result = usePermissions(privileges, 'INCIDENTNOTE', 'IncidentNote')
    expect(result).toEqual(['Read'])
  })

  it('returns empty array when no key matches', () => {
    const privileges: DomainPrivileges = { Other: ['Read'] }
    const result = usePermissions(privileges, 'Appointment')
    expect(result).toEqual([])
  })
})
