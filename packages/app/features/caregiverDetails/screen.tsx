'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import _ from 'lodash'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { CaregiverProfileInfo } from 'app/ui/caregiverProfileInfo'
import {
  BASE_URL,
  DELETE_CAREGIVER,
  GET_CAREGIVER_DETAILS
} from 'app/utils/urlConstants'
import { formatUrl } from 'app/utils/format-url'
import { logger } from 'app/utils/logger'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPemissions'
let caregiverPrivileges = {}
export function CaregiverDetailsScreen() {
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let caregiverInfo = item.caregiverDetails
    ? JSON.parse(item.caregiverDetails)
    : {}
  // console.log('memberData', '' + JSON.stringify(memberData))

  const [isLoading, setLoading] = useState(false)
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false)

  const [fullName, setFullName] = useState('')
  const [status, setStatus] = useState('')
  const [profile, setProfile] = useState('')
  const [email, setEmail] = useState('')
  const [caregiverDetails, setCaregiverDetails] = useState({}) as any
  let memberFullName = ''

  if (!_.isEmpty(memberData)) {
    memberFullName += memberData.firstname ? memberData.firstname : ''
    memberFullName += memberData.lastname ? ' ' + memberData.lastname : ''
  }
  const [memberName, setMemberName] = useState(memberFullName)
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
          if (data.data.domainObjectPrivileges) {
            caregiverPrivileges = data.data.domainObjectPrivileges.Caregiver
              ? data.data.domainObjectPrivileges.Caregiver
              : {}
          }
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
        logger.debug('error', error)
      })
  }, [])
  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/caregiversList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  useEffect(() => {
    getCaregiverDetails()
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  let titleStyle = 'font-400 w-[20%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[75%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          {title !== 'Status' ? (
            <Typography className={valueStyle}>{value}</Typography>
          ) : (
            <Typography
              className={`ml-2 mr-5 rounded-[5px] px-5 py-1 text-right font-bold ${value.toLowerCase() === 'active' ? "bg-['#27ae60'] text-white" : "bg-['#d5d8dc'] text-black"}`}
            >
              {value}
            </Typography>
          )}
        </View>
      </View>
    )
  }
  const cancelClicked = () => {
    setIsShowProfileInfo(false)
  }

  async function deleteCaregiver() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_CAREGIVER}`
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
          router.dismiss(2)
          router.replace(
            formatUrl('/circles/caregiversList', {
              memberData: JSON.stringify(memberData)
            })
          )
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        logger.debug('error', error)
      })
  }

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Caregiver Details" memberData={memberData} />
      <View className="h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%]" />
              <Button
                className=""
                title="Edit"
                variant="border"
                onPress={() => {
                  // setIsAddCaregiver(true)
                  router.push(
                    formatUrl('/circles/addEditCaregiver', {
                      memberData: JSON.stringify(memberData),
                      caregiverDetails: JSON.stringify(caregiverDetails)
                    })
                  )
                }}
              />
            </View>
            {getDetailsView('Name', fullName)}
            {getDetailsView('Email', email)}
            {getDetailsView('Status', status)}
            <View className="flex-row">
              {getDetailsView('Profile', profile)}
              <Feather
                onPress={() => {
                  setIsShowProfileInfo(true)
                }}
                className="ml-[-10px] mt-2"
                name={'info'}
                size={20}
                color={'#1a7088'}
              />
            </View>

            {getUserPermission(caregiverPrivileges).deletePermission ? (
              <View className="my-5">
                <Button
                  className=""
                  title="Remove from circle"
                  variant="borderRed"
                  onPress={() => {
                    Alert.alert(
                      '',
                      `Dear ${memberName}, \nYou are about to remove ${fullName} from circle of ${memberName}.\n\nOnce removed, ${fullName} cannot view or monitor appointments, Incidents, Purchases, Notes and Communications associated with ${memberName}.\n\nDo you want to continue?`,
                      [
                        {
                          text: 'Ok',
                          onPress: () => deleteCaregiver()
                        },
                        { text: 'Cancel', onPress: () => {} }
                      ]
                    )
                  }}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      </View>

      {isShowProfileInfo ? (
        <View className="h-full w-full justify-center">
          <CaregiverProfileInfo cancelClicked={cancelClicked} />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
