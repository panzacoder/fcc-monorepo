import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { getNameInitials, getColorSet } from 'app/ui/utils'
import store from 'app/redux/store'
import { cn } from './utils'
export type Props = {
  fullName?: string
  className?: string
}
const PtsNameInitials = ({ fullName, className }: Props) => {
  let memberNamesList: any = store.getState().memberNames.memberNamesList
  let backgroundColor = getColorSet(memberNamesList.indexOf(fullName) % 26)
  return (
    <View
      className={`h-[36px] w-[36px] items-center justify-center rounded-full ${backgroundColor}`}
    >
      <Typography className="self-center text-[18px] text-white">
        {getNameInitials(fullName)}
      </Typography>
    </View>
  )
}
export default PtsNameInitials
