import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useRouter } from 'solito/navigation'


export function SplashScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-[#6493d9]">
      <Text className="absolute top-[220] z-[1] self-center text-center text-[38px] font-bold text-white">
        {"Caregiving isn't \neasy.\n\n Let's lighten the load a bit."}
      </Text>
      <Image
        alt=""
        source={require('../../../../assets/logo.png')}
        className="absolute top-[40] z-[-1] h-[178] w-[223] self-center"
        resizeMode={'contain'}
      />
      <Image
        alt=""
        source={require('../../../../assets/shapes.png')}
        className=" mr-[-20] mt-[140] self-center"
        resizeMode={'contain'}
      />

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
            alt=""
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
            alt=""
            source={require('../../../../assets/arrow_right.png')}
            className="absolute bottom-[0] right-[10] "
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>

      {/* <Image */}
      {/*     alt="" */}
      {/*     source={require('../../../../assets/splash.png')} */}
      {/*     className=" mt-[140] self-center" */}
      {/*     resizeMode={'cover'} */}
      {/* /> */}
    </View>
  )
}
