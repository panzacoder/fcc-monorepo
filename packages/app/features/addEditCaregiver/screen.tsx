import { useState, useRef, useEffect } from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { CaregiverProfileInfo } from 'app/ui/caregiverProfileInfo'
import {
  useFindCaregiverByEmailPhone,
  useCreateCaregiver,
  useUpdateCaregiver
} from 'app/data/caregivers'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatUrl } from 'app/utils/format-url'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from 'app/ui/icons'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
const schema = z.object({
  profileIndex: z.number().min(0, { message: 'Profile is required' }),
  email: z.string().min(1, { message: 'Required' }),
  firstName: z.string().min(1, { message: 'First name is required ' }),
  lastName: z.string().min(1, { message: 'Last name is required ' })
})
const phoneSchema = z.object({
  phone: z.string()
})
export type Schema = z.infer<typeof schema>
export function AddEditCaregiverScreen() {
  const profileRef = useRef('')
  const profileIndexRef = useRef(-1)
  const emailRef = useRef('')
  let caregiverPhone = ''
  const router = useRouter()
  const item = useLocalSearchParams<any>()
  let caregiverDetails = item.caregiverDetails
    ? JSON.parse(item.caregiverDetails)
    : {}
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const header = useAppSelector((state) => state.headerState.header)
  const [memberId, setMemberId] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false)
  const [isMemberFound, setIsMemberFound] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [status, setStatus] = useState(
    !_.isEmpty(caregiverDetails) && caregiverDetails.familyMemberMemberStatus
      ? caregiverDetails.familyMemberMemberStatus.status
      : ''
  )
  let fullName = ''
  if (!_.isEmpty(caregiverDetails)) {
    fullName += caregiverDetails.firstName ? caregiverDetails.firstName : ''
    fullName += caregiverDetails.middleName
      ? ' ' + caregiverDetails.middleName
      : ''
    fullName += caregiverDetails.lastName ? ' ' + caregiverDetails.lastName : ''
    if (caregiverDetails.relationRole) {
      profileRef.current = caregiverDetails.relationRole.name
        ? caregiverDetails.relationRole.name
        : ''
    }
  }
  const [memberName, setMemberName] = useState(fullName)
  type ProfileResponse = {
    id: number
    name: string
  }
  const profileList: Array<{ id: number; title: string }> =
    staticData.profileList.map(({ name, id }: ProfileResponse, index: any) => {
      if (!_.isEmpty(caregiverDetails)) {
        if (profileRef.current === name) {
          profileIndexRef.current = index + 1
        }
      }
      return {
        id: index + 1,
        title: name
      }
    })
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      profileIndex: profileIndexRef.current,
      email:
        !_.isEmpty(caregiverDetails) && caregiverDetails.email
          ? caregiverDetails.email
          : '',
      firstName:
        !_.isEmpty(caregiverDetails) && caregiverDetails.firstName
          ? caregiverDetails.firstName
          : '',
      lastName:
        !_.isEmpty(caregiverDetails) && caregiverDetails.lastName
          ? caregiverDetails.lastName
          : ''
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      phone:
        !_.isEmpty(caregiverDetails) && caregiverDetails.phone
          ? caregiverDetails.phone
          : ''
    },
    resolver: zodResolver(phoneSchema)
  })

  const { data: searchData, isFetching: isSearching } =
    useFindCaregiverByEmailPhone(header, { email: searchEmail })

  const createCaregiverMutation = useCreateCaregiver(header)
  const updateCaregiverMutation = useUpdateCaregiver(header)

  useEffect(() => {
    if (!searchEmail) return
    if (isSearching) return

    if (searchData) {
      setIsMemberFound(true)
      let name = ''
      name += (searchData as any).firstName ? (searchData as any).firstName : ''
      name += (searchData as any).middleName
        ? '' + (searchData as any).middleName
        : ''
      name += (searchData as any).lastName
        ? ' ' + (searchData as any).lastName
        : ''
      setMemberName(name)
      setMemberId((searchData as any).id ? (searchData as any).id : '')
      setMemberEmail((searchData as any).email ? (searchData as any).email : '')
      reset({
        email: 'default',
        firstName: 'default',
        lastName: 'default'
      })
      reset1({
        phone: 'default'
      })
    } else {
      setIsMemberFound(false)
    }
  }, [searchData, isSearching, searchEmail])

  const isMutating =
    createCaregiverMutation.isPending || updateCaregiverMutation.isPending

  function findCaregiver() {
    if (emailRef.current !== '') {
      setSearchEmail(emailRef.current)
    }
  }
  async function createUpdateCaregiver(object: any) {
    const mutation = _.isEmpty(caregiverDetails)
      ? createCaregiverMutation
      : updateCaregiverMutation

    mutation.mutate(
      { familyMember: object },
      {
        onSuccess: (data: any) => {
          let details = data && data.familyMember ? data.familyMember : {}
          if (_.isEmpty(caregiverDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }
          router.push(
            formatUrl('/circles/caregiverDetails', {
              caregiverDetails: JSON.stringify(details),
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to save caregiver')
        }
      }
    )
  }
  async function callCreateUpdateDevice(formData: Schema) {
    let object = {}
    if (isMemberFound) {
      object = {
        memberId: memberData.member ? memberData.member : '',
        familyMemberId: memberId,
        relationRole: {
          name: staticData.profileList[formData.profileIndex - 1].name,
          uid: staticData.profileList[formData.profileIndex - 1].uid
        }
      }
    } else if (_.isEmpty(caregiverDetails)) {
      object = {
        email: formData.email,
        phone: removeAllSpecialCharFromString(caregiverPhone),
        firstName: formData.firstName,
        lastName: formData.lastName,
        memberId: memberData.member ? memberData.member : '',
        relationRole: {
          name: staticData.profileList[formData.profileIndex - 1].name,
          uid: staticData.profileList[formData.profileIndex - 1].uid
        }
      }
    } else {
      object = {
        memberId: caregiverDetails.memberId ? caregiverDetails.memberId : '',
        id: caregiverDetails.id ? caregiverDetails.id : '',
        familyMemberMemberStatus: {
          status: status
        },
        relationRole: {
          name: staticData.profileList[formData.profileIndex - 1].name,
          uid: staticData.profileList[formData.profileIndex - 1].uid
        }
      }
    }

    logger.debug('object', JSON.stringify(object))
    createUpdateCaregiver(object)
  }
  let titleStyle = 'font-400 w-[20%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-1 w-[75%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          {title !== 'Status' ? (
            <Typography className={valueStyle}>{value}</Typography>
          ) : (
            <TouchableOpacity
              onPress={() => {
                status === 'Active'
                  ? setStatus('Inactive')
                  : setStatus('Active')
              }}
            >
              <Typography
                className={`ml-2 mr-5 rounded-[5px] px-5 py-1 text-right font-bold ${value.toLowerCase() === 'active' ? "bg-['#27ae60'] text-white" : "bg-['#d5d8dc'] text-black"}`}
              >
                {value}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
  const cancelClicked = () => {
    setIsShowProfileInfo(false)
  }
  const infoClicked = () => {
    setIsShowProfileInfo(true)
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isSearching || isMutating} />
      <PtsBackHeader
        title={_.isEmpty(caregiverDetails) ? 'Add Caregiver' : 'Edit Caregiver'}
        memberData={memberData}
      />
      <SafeAreaView className="flex-1">
        <ScrollView
          className={`${_.isEmpty(caregiverDetails) ? ' mt-5 max-h-[90%]' : ' mt-10 max-h-[60%]'} w-full flex-1 self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2`}
        >
          <View className="my-2 w-full">
            {isMemberFound ? (
              <View className="my-2 w-full justify-center">
                <View className="mx-[10px]">
                  {getDetailsView('Name', memberName)}
                  {getDetailsView('Email', memberEmail)}
                </View>
                <View className="flex-row">
                  <ControlledDropdown
                    control={control}
                    name="profileIndex"
                    label="Profile*"
                    maxHeight={300}
                    list={profileList}
                    className="ml-2 mt-2 w-[85%]"
                    defaultValue={
                      !_.isEmpty(caregiverDetails) ? profileRef.current : ''
                    }
                  />
                  <Feather
                    onPress={() => {
                      infoClicked()
                    }}
                    className="ml-2 mt-5 self-center"
                    name={'info'}
                    size={20}
                    color={'#1a7088'}
                  />
                </View>
              </View>
            ) : (
              <View>
                {_.isEmpty(caregiverDetails) ? (
                  <View className="my-2 w-full justify-center">
                    <ControlledTextField
                      control={control}
                      name="email"
                      placeholder={'Email*'}
                      className="mt-2 w-[95%] self-center bg-white"
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        emailRef.current = text
                      }}
                      onBlur={() => {
                        findCaregiver()
                      }}
                    />
                    <ControlledTextField
                      control={control1}
                      name="phone"
                      placeholder={'Phone'}
                      className="mt-2 w-[95%] self-center bg-white"
                      keyboard="number-pad"
                      onChangeText={(value) => {
                        caregiverPhone =
                          convertPhoneNumberToUsaPhoneNumberFormat(value)

                        reset1({
                          phone: caregiverPhone
                        })
                      }}
                    />
                    <ControlledTextField
                      control={control}
                      name="firstName"
                      placeholder={'First Name*'}
                      className="mt-2 w-[95%] self-center bg-white"
                    />
                    <ControlledTextField
                      control={control}
                      name="lastName"
                      placeholder={'Last Name*'}
                      className="mt-2 w-[95%] self-center bg-white"
                    />
                    <View className="flex-row ">
                      <ControlledDropdown
                        control={control}
                        name="profileIndex"
                        label="Profile*"
                        maxHeight={300}
                        list={profileList}
                        className="ml-2 mt-2 w-[85%]"
                        defaultValue={
                          !_.isEmpty(caregiverDetails) ? profileRef.current : ''
                        }
                      />
                      <Feather
                        onPress={() => {
                          infoClicked()
                        }}
                        className="ml-2 mt-5 self-center"
                        name={'info'}
                        size={20}
                        color={'#1a7088'}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="my-2 w-full justify-center">
                    <View className="mx-[10px]">
                      {getDetailsView('Name', fullName)}
                      {getDetailsView('Email', caregiverDetails.email)}
                      {getDetailsView('Status', status)}
                    </View>
                    <View className="flex-row">
                      <ControlledDropdown
                        control={control}
                        name="profileIndex"
                        label="Profile*"
                        maxHeight={300}
                        list={profileList}
                        className="ml-2 mt-2 w-[85%]"
                        defaultValue={
                          !_.isEmpty(caregiverDetails) ? profileRef.current : ''
                        }
                      />
                      <Feather
                        onPress={() => {
                          infoClicked()
                        }}
                        className="ml-2 mt-5 self-center"
                        name={'info'}
                        size={20}
                        color={'#1a7088'}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}

            <View className="my-2 mt-5 flex-row justify-center">
              <Button
                className="bg-[#86939e]"
                title="Cancel"
                variant="default"
                leadingIcon="x"
                onPress={() => {
                  router.back()
                }}
              />
              <Button
                className="ml-5"
                leadingIcon="save"
                title={_.isEmpty(caregiverDetails) ? 'Create' : 'Save'}
                variant="default"
                onPress={handleSubmit(callCreateUpdateDevice)}
              />
            </View>
            {isShowProfileInfo ? (
              <View className="top-50 absolute h-full w-full">
                <CaregiverProfileInfo cancelClicked={cancelClicked} />
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
