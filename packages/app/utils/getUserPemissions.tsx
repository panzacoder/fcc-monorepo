export function getUserPermission(previliges: any) {
  if (!previliges) {
    return {
      readPermission: false,
      deletePermission: false,
      updatePermission: false,
      createPermission: false
    }
  }

  let allPermission = false
  let createPermission = false
  let readPermission = false
  let updatePermission = false
  let deletePermission = false
  for (let i = 0; i < previliges.length; i++) {
    switch (previliges[i]) {
      case '*':
        allPermission = true
        createPermission = true
        readPermission = true
        updatePermission = true
        deletePermission = true
        break
      case 'Create':
        createPermission = true
        readPermission = true
        break
      case 'Update':
        updatePermission = true
        readPermission = true
        break
      case 'Delete':
        deletePermission = true
        readPermission = true
        break
      case 'Read':
        readPermission = true
      default:
        readPermission = true
    }
  }

  return {
    readPermission,
    deletePermission,
    updatePermission,
    createPermission
  }
}
