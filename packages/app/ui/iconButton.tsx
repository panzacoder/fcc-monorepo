import Feather from '@expo/vector-icons/Feather'

import Button from './button'

export default function IconButton({ icon, ...props }) {
  return (
    <Button {...props}>
      <Feather name={icon} size={24} />
    </Button>
  )
}
