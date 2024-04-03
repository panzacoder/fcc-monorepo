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
        'bg-primary h-[36px] w-[36px] items-center justify-center rounded-full',
        className
      )}
    >
      <Typography className="self-center text-[18px] text-white">
        {getNameInitials(fullName)}
      </Typography>
    </View>
  )
}
export default PtsNameInitials
