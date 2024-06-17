import { FC, useState } from 'react'
import { TouchableOpacity, View, Alert } from 'react-native'
import store from 'app/redux/store'
import PtsNameInitials from '../PtsNameInitials'
import { Feather } from '../icons'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, USER_LOGOUT } from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import PtsLoader from 'app/ui/PtsLoader'
// import * as SecureStore from 'expo-secure-store'

export type TabsHeaderProps = {
  navigation: any
  route: any
  options: any
  back?: {
    title: string
    onPress: () => void
  }
}

const MenuButton: FC<{
  text: string
  icon: any
  onPress: () => void
}> = ({ text, icon, onPress }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className="w-full flex-row self-center bg-white px-2 py-1"
      >
        <Feather name={icon} size={20} className="mr-2" color={'gray'} />
        <Typography className="font-400">{text}</Typography>
      </TouchableOpacity>
      <View className="h-[0.5px] w-full bg-gray-400" />
    </View>
  )
}

export const TabsHeader = ({}) => {
  const router = useRouter()
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const user = store.getState().userProfileState.header
  const header = store.getState().headerState.header
  async function logout() {
    setLoading(true)
    let url = `${BASE_URL}${USER_LOGOUT}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // await SecureStore.deleteItemAsync('Username')
          // await SecureStore.deleteItemAsync('Password')
          router.push('/login')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View style={{ zIndex: 3 }}>
      <PtsLoader loading={isLoading} />
      <View className="absolute right-0 top-0 w-1/4 flex-row justify-end gap-2">
        {user.memberName && (
          <PtsNameInitials className="" fullName={user.memberName} />
        )}
        <TouchableOpacity
          className="bg-accent rounded-full p-2"
          onPress={() => {
            setIsShowMenu(!isShowMenu)
          }}
        >
          <Feather
            name={'menu'}
            size={25}
            className="color-accent-foreground"
          />
        </TouchableOpacity>
      </View>
      {isShowMenu ? (
        <View className="absolute right-5 top-10 w-[40%] border-[1px] border-gray-400 bg-white">
          <MenuButton
            text="Profile"
            icon="user"
            onPress={() => {
              router.push('/profile')
            }}
          />
          <MenuButton
            text="T&C"
            icon="clipboard"
            onPress={() => {
              router.push('/termsAndConditions')
            }}
          />
          <MenuButton
            text="Privacy Policy"
            icon="file-text"
            onPress={() => {
              router.push('/privacyPolicy')
            }}
          />
          <MenuButton
            text="Help"
            icon="help-circle"
            onPress={() => {
              router.push('/help')
            }}
          />
          <MenuButton
            text="FAQ"
            icon="info"
            onPress={() => {
              router.push('/faq')
            }}
          />
          <MenuButton
            text="Refer A Friend"
            icon="user-plus"
            onPress={() => {
              router.push('/referFriend')
            }}
          />
          <MenuButton
            text="About Us"
            icon="info"
            onPress={() => {
              router.push('/aboutUs')
            }}
          />
          <MenuButton
            text="Logout"
            icon="log-out"
            onPress={() => {
              setIsShowMenu(false)
              logout()
            }}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

// MenuButton('Logout', 'log-out')}
