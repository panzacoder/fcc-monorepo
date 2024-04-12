'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { getFullDateForCalender } from 'app/ui/utils'
import { BASE_URL, GET_CAREGIVER_DETAILS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { Location } from 'app/ui/location'
import { Button } from 'app/ui/button'

export function CaregiverDetailsScreen() {
  // console.log('in caregiverDetailsScreen')
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const router = useRouter()
  let caregiverInfo = item.caregiverDetails
    ? JSON.parse(item.caregiverDetails)
    : {}
  // console.log('caregiverDetails', '' + JSON.stringify(caregiverInfo))
  const [isLoading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [status, setStatus] = useState('')
  const [profile, setProfile] = useState('')
  const [email, setEmail] = useState('')
  const [caregiverDetails, setCaregiverDetails] = useState({}) as any

  const getCaregiverDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_CAREGIVER_DETAILS}`
    let dataObject = {
      header: header,
      familyMember: {
        id: caregiverInfo.id ? caregiverInfo.id : '',
        memberId: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setCaregiverDetails(data.data.familyMember || {})
          // console.log('appointmentList', JSON.stringify(appointmentList))
          if (data.data.familyMember) {
            let details = data.data.familyMember
            let fullName = ''
            if (details.firstName) {
              fullName += details.firstName
            }
            if (details.lastName) {
              fullName += ' ' + details.lastName
            }
            setFullName(fullName)
            if (details.email) {
              setEmail(details.email)
            }
            if (details.familyMemberMemberStatus) {
              let status = details.familyMemberMemberStatus.status
                ? details.familyMemberMemberStatus.status
                : ''
              setStatus(status)
            }
            if (details.relationRole) {
              let profile = details.relationRole.name
                ? details.relationRole.name
                : ''
              setProfile(profile)
            }
          }
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getCaregiverDetails()
  }, [])
  let titleStyle = 'font-400 w-[20%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[75%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(
    title: string,
    value: string,
    isIcon: boolean,
    iconValue: any
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          {title !== 'Status' ? (
            <Typography className={valueStyle}>{value}</Typography>
          ) : (
            <Typography
              // className={
              //   value.toLowerCase() === 'active'
              //     ? "ml-2 mr-5 rounded-[5px] bg-['#27ae60'] px-5 text-right text-white font-bold py-1"
              //     : "ml-2 mr-5 rounded-[5px] bg-['#d5d8dc'] px-5 text-right font-bold py-1"
              // }
              className={`ml-2 mr-5 rounded-[5px] px-5 py-1 text-right font-bold ${value.toLowerCase() === 'active' ? "bg-['#27ae60'] text-white" : "bg-['#d5d8dc'] text-black"}`}
            >
              {value}
            </Typography>
          )}
        </View>
        {isIcon ? (
          <Feather
            className="ml-[-10px]"
            name={iconValue}
            size={20}
            color={'black'}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%]" />
              <Button
                className=""
                title="Edit"
                variant="border"
                onPress={() => {
                  // router.push(
                  //   formatUrl('/circles/addEditDoctor', {
                  //     memberData: JSON.stringify(memberData),
                  //     caregiverDetails: JSON.stringify(caregiverDetails),
                  //     component: 'Doctor'
                  //   })
                  // )
                }}
              />
            </View>
            {getDetailsView('Name', fullName, false, '')}
            {getDetailsView('Email', email, false, '')}
            {getDetailsView('Status', status, false, '')}
            {getDetailsView('Profile', profile, false, '')}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
