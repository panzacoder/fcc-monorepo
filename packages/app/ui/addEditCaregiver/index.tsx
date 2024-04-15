import { useState } from 'react'
import { Alert, View, ScrollView, TouchableOpacity } from 'react-native'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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

export const AddEditCaregiver = ({
  caregiverDetails,
  cancelClicked,
  createUpdateCaregiver,
  memberData
}) => {
  const staticData: any = store.getState().staticDataState.staticData
  const [status, setStatus] = useState(
    !_.isEmpty(caregiverDetails) && caregiverDetails.familyMemberMemberStatus
      ? caregiverDetails.familyMemberMemberStatus.status
      : ''
  )
  // console.log('caregiverDetails', JSON.stringify(caregiverDetails))
  let fullName = ''
  if (!_.isEmpty(caregiverDetails)) {
    fullName += caregiverDetails.firstName
    fullName += ' ' + caregiverDetails.lastName
    if (caregiverDetails.relationRole) {
      profile = caregiverDetails.relationRole.name
        ? caregiverDetails.relationRole.name
        : ''
    }
  }
  const profileList = staticData.profileList.map((data: any, index: any) => {
    if (!_.isEmpty(caregiverDetails)) {
      if (profile === data.name) {
        profileIndex = index + 1
      }
    }
    return {
      title: data.name,
      id: index + 1
    }
  })
  const { control, handleSubmit } = useForm({
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
  async function callCreateUpdateDevice(formData: Schema) {
    let object = {}
    if (_.isEmpty(caregiverDetails)) {
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

    // console.log('object', JSON.stringify(object))
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
      <View className="my-2 w-full">
        {_.isEmpty(caregiverDetails) ? (
          <View className="my-2 w-full justify-center">
            <ControlledTextField
              control={control}
              name="email"
              placeholder={'Email*'}
              className="mt-2 w-[95%] self-center bg-white"
              autoCapitalize="none"
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
            <ControlledDropdown
              control={control}
              name="profileIndex"
              label="Profile*"
              maxHeight={300}
              list={profileList}
              className="mt-2 w-[95%] self-center"
              defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
            />
          </View>
        ) : (
          <View className="my-2 w-full justify-center">
            <View className="mx-[10px]">
              {getDetailsView('Name', fullName)}
              {getDetailsView('Email', caregiverDetails.email)}
              {getDetailsView('Status', status)}
            </View>
            <ControlledDropdown
              control={control}
              name="profileIndex"
              label="Profile*"
              maxHeight={300}
              list={profileList}
              className="mt-2 w-[95%] self-center"
              defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
            />
          </View>
        )}

        <View className="my-2 mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={_.isEmpty(caregiverDetails) ? 'Save' : 'Update'}
            variant="default"
            onPress={handleSubmit(callCreateUpdateDevice)}
          />
        </View>
      </View>
    </ScrollView>
  )
}
