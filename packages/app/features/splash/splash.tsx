import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { MotiLink } from 'solito/moti'
import { useRouter } from 'solito/navigation'

import { Typography, A, TextLink } from 'app/ui/typography'
import Button from 'app/ui/button'
import { Row } from 'app/ui/layout'

export function SplashScreen() {
    useEffect(() => {
        setTimeout(() => setTimer(true), 2000)
    }, [])
    const router = useRouter()
    const [isTimerEnd, setTimer] = useState(false)
    const height = Dimensions.get('window').height
    return (
        <View className="flex-1 bg-[#6493d9]">
            {isTimerEnd ? (
                <Text className="absolute top-[220] z-[1] self-center text-center text-[38px] font-bold text-white">
                    {"Caregiving isn't \neasy.\n\n Let's lighten the load a bit."}
                </Text>
            ) : (
                <View />
            )}
            <Image
                source={require('../../../../assets/logo.png')}
                className="absolute top-[40] z-[-1] h-[178] w-[223] self-center"
                resizeMode={'contain'}
            />
            <Image
                source={require('../../../../assets/shapes.png')}
                className=" mr-[-20] mt-[140] self-center"
                resizeMode={'contain'}
            />

            {isTimerEnd ? (
                <View>
                    <TouchableOpacity
                        className="flex-row"
                        onPress={() => {
                            console.log('in login ')
                            router.replace('/login')
                        }}
                    >
                        <Text className="absolute bottom-[65] right-[65] self-center text-center text-[28px] font-bold text-white">
                            {'Login'}
                        </Text>
                        <Image
                            source={require('../../../../assets/arrow_right.png')}
                            className="absolute bottom-[60] right-[10] "
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row"
                        onPress={() => {
                            console.log('in sign up ')
                            router.replace('/circles')
                        }}
                    >
                        <Text className="absolute bottom-[5] right-[65] self-center text-center text-[28px] font-bold text-white ">
                            {'Sign Up'}
                        </Text>
                        <Image
                            source={require('../../../../assets/arrow_right.png')}
                            className="absolute bottom-[0] right-[10] "
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <View />
            )}

            {/* <Image
                source={require('../../../../assets/splash.png')}
                className=" self-center mt-[140]"
                resizeMode={'cover'}

            /> */}
        </View>
    )
}
