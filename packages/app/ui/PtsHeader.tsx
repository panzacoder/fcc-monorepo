import { Text, View } from 'react-native'
export type Props = {
  title?: string
}
const PtsHeader = ({ title }: Props) => {
  return (
    <View
      style={{ width: '100%' }}
      className="h-[80] justify-center bg-[#6493d9]"
    >
      <Text className="mt-[20] text-center text-[18px] font-bold text-white">
        {title}
      </Text>
    </View>
  )
}
export default PtsHeader
