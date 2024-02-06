import { View, Image, Text, Pressable, PressableProps } from 'react-native'
export type ButtonProps = PressableProps & {
    title?: string
    className?: string
    onPress?: {}
}
const fccButton = ({ title, className = '', onPress }: ButtonProps) => {
    return (
        <Pressable className={className} onPress={onPress}>
            <Text className="self-center text-center  font-bold text-white">
                {title}
            </Text>
            <Image
                source={require('app/assets/arrow.png')}
                className="absolute right-[10] self-center"
                resizeMode={'contain'}
                alt="arrow"
            />
        </Pressable>
    )
}
export default fccButton
