import { useMemo } from 'react'
import type { DomainPrivileges, PrivilegeAction } from 'app/data/types.d'

export function usePermissions(
  domainObjectPrivileges: DomainPrivileges | null | undefined,
  ...keys: string[]
): PrivilegeAction[] {
  return useMemo(() => {
    if (!domainObjectPrivileges) return []
    for (const key of keys) {
      const privs = domainObjectPrivileges[key]
      if (privs?.length) return privs
    }
    return []
  }, [domainObjectPrivileges]) // eslint-disable-line react-hooks/exhaustive-deps
}
