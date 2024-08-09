import { Divider } from 'app/ui/divider'
import { Typography } from 'app/ui/typography'
import { useWatch } from 'react-hook-form'
import { AddressFields } from 'app/ui/form-fields/address-fields'
import { CreateCircleSchema } from './form-helpers'

export function CircleAddressSection() {
  const [firstName, lastName, email, authorizedCaregiver] =
    useWatch<CreateCircleSchema>({
      name: ['firstName', 'lastName', 'email', 'authorizedCaregiver']
    })
  if (!(firstName && lastName && (email || authorizedCaregiver))) {
    return null
  }
  return (
    <>
      <Divider className="bg-muted" />
      <Typography variant="h4">
        {`What is ${firstName}'s primary address?`}
      </Typography>
      <AddressFields className="w-full" />
    </>
  )
}
