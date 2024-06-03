import { useState } from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, FIND_CAREGIVER_BY_EMAIL_PHONE } from 'app/utils/urlConstants'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
let profile = ''
let profileIndex = -1
const schema = z.object({
  profileIndex: z.number().min(0, { message: 'Profile is required' }),
  email: z.string().min(1, { message: 'Required' }),
  phone: z.string(),
  firstName: z.string().min(1, { message: 'First name is required ' }),
  lastName: z.string().min(1, { message: 'Last name is required ' })
})
export type Schema = z.infer<typeof schema>
let email = ''
export const AddEditCaregiver = ({
  caregiverDetails,
  cancelClicked,
  createUpdateCaregiver,
  memberData,
  infoClicked
}) => {
  const staticData: any = store.getState().staticDataState.staticData
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [memberId, setMemberId] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [isMemberFound, setIsMemberFound] = useState(false)
  const [status, setStatus] = useState(
    !_.isEmpty(caregiverDetails) && caregiverDetails.familyMemberMemberStatus
      ? caregiverDetails.familyMemberMemberStatus.status
      : ''
  )
  // console.log('caregiverDetails', JSON.stringify(caregiverDetails))
  let fullName = ''
  if (!_.isEmpty(caregiverDetails)) {
    fullName += caregiverDetails.firstName ? caregiverDetails.firstName : ''
    fullName += caregiverDetails.middleName
      ? ' ' + caregiverDetails.middleName
      : ''
    fullName += caregiverDetails.lastName ? ' ' + caregiverDetails.lastName : ''
    if (caregiverDetails.relationRole) {
      profile = caregiverDetails.relationRole.name
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
        if (profile === name) {
          profileIndex = index + 1
        }
      }
      return {
        id: index + 1,
        title: name
      }
    })
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      profileIndex: profileIndex,
      email:
        !_.isEmpty(caregiverDetails) && caregiverDetails.email
          ? caregiverDetails.email
          : '',
      phone:
        !_.isEmpty(caregiverDetails) && caregiverDetails.phone
          ? caregiverDetails.phone
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
  async function findCaregiver() {
    if (email !== '') {
      setLoading(true)
      let url = `${BASE_URL}${FIND_CAREGIVER_BY_EMAIL_PHONE}`
      let dataObject = {
        header: header,
        member: {
          email: email
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // console.log('findCaregiver', JSON.stringify(data))
            data.data ? setIsMemberFound(true) : setIsMemberFound(false)
            if (data.data) {
              fullName += data.data.firstName ? data.data.firstName : ''
              fullName += data.data.middleName ? '' + data.data.middleName : ''
              fullName += data.data.lastName ? ' ' + data.data.lastName : ''
              setMemberName(fullName)
              setMemberId(data.data.id ? data.data.id : '')
              setMemberEmail(data.data.email ? data.data.email : '')
              reset({
                email: 'default',
                firstName: 'default',
                phone: 'default',
                lastName: 'default'
              })
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
    }
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
        phone: formData.phone,
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

    console.log('object', JSON.stringify(object))
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

  return (
    <ScrollView
      className={`${_.isEmpty(caregiverDetails) ? ' mt-5 max-h-[80%]' : ' mt-10 max-h-[60%]'} w-full self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2 `}
    >
      <PtsLoader loading={isLoading} />

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
                defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
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
                    email = text
                  }}
                  onBlur={() => {
                    findCaregiver()
                  }}
                />
                <ControlledTextField
                  control={control}
                  name="phone"
                  placeholder={'Phone'}
                  className="mt-2 w-[95%] self-center bg-white"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="firstName"
                  placeholder={'First Name*'}
                  className="mt-2 w-[95%] self-center bg-white"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="lastName"
                  placeholder={'Last Name*'}
                  className="mt-2 w-[95%] self-center bg-white"
                  autoCapitalize="none"
                />
                <View className="flex-row ">
                  <ControlledDropdown
                    control={control}
                    name="profileIndex"
                    label="Profile*"
                    maxHeight={300}
                    list={profileList}
                    className="ml-2 mt-2 w-[85%]"
                    defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
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
                    defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
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
              cancelClicked()
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
      </View>
    </ScrollView>
  )
}
