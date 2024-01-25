import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import { MotiLink } from 'solito/moti';
import { useRouter } from 'solito/navigation';

import { Typography, A, TextLink } from 'app/ui/typography';
import Button from 'app/ui/button';
import { Row } from 'app/ui/layout';


export function SplashScreen() {
    useEffect(() => {

        setTimeout(
            () => setTimer(true),
            2000,
        );
    }, []);
    const router = useRouter();
    const [isTimerEnd, setTimer] = useState(false);
    const height = Dimensions.get('window').height;
    return (

        <View className="flex-1 bg-[#6493d9]">
            {
                isTimerEnd ?
                    <View className="">
                        <Text className="text-[38px] font-bold text-white self-center text-center absolute top-[220] z-[1]">{"Caregiving isn't \neasy.\n\n Let's lighten the load a bit."}</Text>
                    </View>
                    : <View />
            }
            <Image
                source={require('../../../../assets/logo.png')}
                className="w-[223] h-[178] self-center absolute top-[40] z-[-1]"
                resizeMode={'contain'}

            />
            <Image
                source={require('../../../../assets/shapes.png')}
                className=" self-center mr-[-20] mt-[140]"
                resizeMode={'contain'}

            />

            {
                isTimerEnd ?
                    <View>

                        <TouchableOpacity className="flex-row"
                            onPress={() => {
                                console.log('in login ');
                                // router.replace('/login');
                            }}>
                            <Text className="text-[28px] font-bold text-white self-center text-center absolute right-[65] bottom-[65]">{"Login"}</Text>
                            <Image
                                source={require('../../../../assets/arrow_right.png')}
                                className="absolute right-[10] bottom-[60] "
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row"
                            onPress={() => {
                                console.log('in sign up ');
                            }}>
                            <Text className="text-[28px] font-bold text-white self-center text-center absolute right-[65] bottom-[5] ">{"Sign Up"}</Text>
                            <Image
                                source={require('../../../../assets/arrow_right.png')}
                                className="absolute right-[10] bottom-[0] "
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>
                    </View>
                    : <View />}

            {/* <Image
                source={require('../../../../assets/splash.png')}
                className=" self-center mt-[140]"
                resizeMode={'cover'}

            /> */}

        </View>
    );
}
