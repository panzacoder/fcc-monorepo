import { useState } from 'react'
import { Pressable, View, Alert } from 'react-native'
import store from 'app/redux/store'
import PtsNameInitials from '../PtsNameInitials'
import { Feather } from '../icons'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, USER_LOGOUT } from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import PtsLoader from 'app/ui/PtsLoader'

export type TabsHeaderProps = {
  navigation: any
  route: any
  options: any
  back?: {
    title: string
    onPress: () => void
  }
}

export function TabsHeader() {
  const router = useRouter()
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const user = store.getState().userProfileState.header
  let itemStyle = 'w-full flex-row self-center bg-white px-2 py-1'
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
  function getMenuView(value: string, icon: any) {
    return (
      <View>
        <Pressable
          onPress={() => {
            if (value === 'Profile') {
              router.push(formatUrl('/profile', {}))
            } else if (value === 'T&C') {
              router.push('/termsAndConditions')
            } else if (value === 'Privacy Policy') {
              router.push('/privacyPolicy')
            } else if (value === 'Logout') {
              setIsShowMenu(false)
              logout()
            }
          }}
          className={itemStyle}
        >
          <Feather name={icon} size={20} className="mr-2" color={'gray'} />
          <Typography className="font-400">{value}</Typography>
        </Pressable>
        <View className="h-[0.5px] w-full bg-gray-400" />
      </View>
    )
  }
  return (
    <View style={{ zIndex: 3 }}>
      <PtsLoader loading={isLoading} />
      <View className="absolute right-0 top-0 w-1/4 flex-row justify-end gap-2">
        <PtsNameInitials className="" fullName={user.memberName} />
        <Pressable
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
        </Pressable>
      </View>
      {isShowMenu ? (
        <View className="absolute right-5 top-10 w-[40%] border-[1px] border-gray-400 bg-white">
          {getMenuView('Profile', 'user')}
          {getMenuView('T&C', 'clipboard')}
          {getMenuView('Privacy Policy', 'file-text')}
          {getMenuView('Help', 'help-circle')}
          {getMenuView('FAQ', 'info')}
          {getMenuView('Refer A Friend', 'user-plus')}
          {getMenuView('About Us', 'help-circle')}
          {getMenuView('Logout', 'log-out')}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
