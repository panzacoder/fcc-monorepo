import { View, Image, Text, Pressable, PressableProps } from 'react-native';
export type ButtonProps = PressableProps &
{
    title?: string;
    className?: string;
    onPress?: {};
};
const fccButton = ({
    title,
    className = '',
    onPress,
}: ButtonProps) => {

    return (
        <Pressable
            className={className}
            onPress={onPress}
        >
            <Text className='text-white font-bold  text-center self-center'>{title}</Text>
            <Image
                source={require('../../../assets/arrow.png')}
                className="absolute right-[10] self-center"
                resizeMode={'contain'}
            />
        </Pressable>
    );
};
export default fccButton;