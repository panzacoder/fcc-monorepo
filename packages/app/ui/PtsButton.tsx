import { View, Image, Text, Pressable, PressableProps } from 'react-native'
export type ButtonProps = PressableProps & {
  title?: string
  isShowIcon?: boolean
  isDisabled?: boolean
  className?: string
  onPress?: {}
}
const PtsButton = ({
  title,
  isShowIcon,
  isDisabled,
  className = '',
  onPress,
}: ButtonProps) => {
  return (
    <Pressable disabled={isDisabled} className={className} onPress={onPress}>
      <Text className="self-center text-center font-bold text-white">
        {title}
      </Text>
      {isShowIcon ? (
        <Image
          source={require('../../../assets/arrow.png')}
          className="absolute right-[10] self-center"
          resizeMode={'contain'}
          alt="arrow"
        />
      ) : (
        <View />
      )}
    </Pressable>
  )
}
export default PtsButton
