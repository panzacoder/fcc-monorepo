'use client'
import { useState, useEffect } from 'react'
import { View, Text, Alert } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import PtsLoader from 'app/ui/PtsLoader'
import { CallPostService } from 'app/utils/fetchServerData'
// import HTMLView from 'react-native-htmlview'
import { BASE_URL, GET_TC_HTML_CONTENT } from 'app/utils/urlConstants'
export function TermsAndConditonScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  useEffect(() => {
    setLoading(true)
    let loginURL = `${BASE_URL}${GET_TC_HTML_CONTENT}`
    let dataObject = {}
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log(
          //   'getHtmlContent',
          //   JSON.stringify(data.data.termsConditions.data)
          // )

          let htmlContent = data.data.termsConditions.data
            ? data.data.termsConditions.data
            : ''
          let htmlContentNew = htmlContent.replaceAll(
            '<p ',
            '<p style="margin:-15"'
          )
          // console.log('htmlContent', JSON.stringify(htmlContentNew))
          setHtmlContent(htmlContentNew)
          setIsDataReceived(true)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="ml-5 mt-[40px] flex-row">
        <Feather
          className="mt-1"
          name={'arrow-left'}
          size={20}
          color={'black'}
          onPress={() => {
            router.back()
          }}
        />
        <Typography className="ml-20 text-lg font-bold">
          {'Terms and conditions'}
        </Typography>
      </View>
      {/* {isDataReceived ? <HTMLView value={htmlContent} /> : <View />} */}
    </View>
  )
}
