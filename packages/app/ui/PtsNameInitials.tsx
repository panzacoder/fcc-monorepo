import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { getNameInitials } from 'app/ui/utils'
import { cn } from './utils'
export type Props = {
  fullName?: any
  className?: string
}
const PtsNameInitials = ({ fullName, className }: Props) => {
  return (
    <View
      className={cn(
        'bg-primary h-[40px] w-[40px] items-center justify-center rounded-full',
        className
      )}
    >
      <Typography className="self-center text-[19px] text-white">
        {getNameInitials(fullName)}
      </Typography>
    </View>
  )
}
export default PtsNameInitials
