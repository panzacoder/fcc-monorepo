import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { getAddressFromObject } from 'app/ui/utils'
import PtsLoader from 'app/ui/PtsLoader'
import {
  BASE_URL,
  GET_TRANSPORTATION_MEMBER_LIST,
  GET_STATES_AND_TIMEZONES,
  CREATE_TRANSPORTATION,
  CREATE_TRANSPORTATION_EVENT,
  UPDATE_TRANSPORTATION,
  UPDATE_TRANSPORTATION_EVENT
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
const schema = z.object({
  member: z.number().min(0, { message: 'Select Member' }),
  description: z.string(),
  addressLine: z.string(),
  state: z.number().min(0, { message: 'State is required' }),
  country: z.number().min(0, { message: 'Country is required' }),
  city: z.string(),
  postalCode: z.string()
})
export type Schema = z.infer<typeof schema>
let selectedDate: any = new Date()
export const AddEditTransport = ({
  component,
  transportData,
  appointmentId,
  cancelClicked,
  createUpdateTransportation
}) => {
  let countryIndex = 96
  let stateIndex = -1
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const staticData = store.getState().staticDataState.staticData
  const [isLoading, setLoading] = useState(false)
  const [memberList, setMemberList] = useState([]) as any
  const [memberListFull, setMemberListFull] = useState([]) as any
  if (!_.isEmpty(transportData)) {
    selectedDate = new Date(transportData.date)
  }
  // console.log('transportData', JSON.stringify(transportData))
  useEffect(() => {
    async function getMemberList() {
      setLoading(true)
      let url = `${BASE_URL}${GET_TRANSPORTATION_MEMBER_LIST}`
      let dataObject = {
        header: header,
        member: {
          id: user.memberId ? user.memberId : ''
        }
      }
      // console.log('dataObject', JSON.stringify(dataObject))
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          setLoading(false)
          if (data.status === 'SUCCESS') {
            let list: object[] = []
            data.data.map((data: any, index: any) => {
              let object = {
                label: data.name,
                value: index
              }
              list.push(object)
            })
            setMemberList(list)
            await setMemberListFull(data.data || [])
            // console.log('setMemberListFull', JSON.stringify(memberListFull))
          } else {
            Alert.alert('', data.message)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    if (_.isEmpty(transportData)) {
      getMemberList()
    }
    getStates(101)
  }, [])

  const { control, handleSubmit } = useForm({
    //some default data has been set for required fields in case of update
    defaultValues: {
      description: '',
      member: _.isEmpty(transportData) ? -1 : 0,
      addressLine: '',
      state: _.isEmpty(transportData) ? stateIndex : 0,
      country: _.isEmpty(transportData) ? countryIndex : 0,
      city: '',
      postalCode: ''
    },
    resolver: zodResolver(schema)
  })
  const [statesList, setStatesList] = useState([])
  const [statesListFull, setStatesListFull] = useState([])

  const countryList = staticData.countryList.map((data: any, index: any) => {
    return {
      label: data.name,
      value: index
    }
  })
  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let list = data.data.stateList.map((data: any, index: any) => {
            return {
              label: data.name,
              value: index
            }
          })
          setStatesList(list)
          setStatesListFull(data.data.stateList || [])
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

  async function createUpdateTransport(formData: Schema) {
    let dataObject = {} as any
    let url = ''
    if (_.isEmpty(transportData)) {
      let stateObject = statesListFull[formData.state]
      let countryObject: object = staticData.countryList[formData.country]

      let address = {
        line: formData.addressLine,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
      dataObject = {
        header: header,
        transportation: {
          date: selectedDate,
          description: formData.description,
          accompany: memberListFull[formData.member].memberId
            ? memberListFull[formData.member].memberId
            : '',
          accompanyType: {
            type: 'Family Member'
          },
          reminderList: []
        }
      }
      dataObject.transportation.address = address
      dataObject.transportation.address.state.country = countryObject
      if (component === 'Appointment') {
        url = `${BASE_URL}${CREATE_TRANSPORTATION}`
        dataObject.transportation.appointment = { id: appointmentId }
      } else {
        url = `${BASE_URL}${CREATE_TRANSPORTATION_EVENT}`
        dataObject.transportation.event = {
          id: appointmentId
        }
      }
    } else {
      dataObject = {
        header: header,
        transportation: {
          id: transportData.id ? transportData.id : '',
          date: selectedDate,
          description: transportData.description
            ? transportData.description
            : '',
          accompany: transportData.accompany ? transportData.accompany : '',
          accompanyType: {
            type:
              transportData.accompanyType && transportData.accompanyType.type
                ? transportData.accompanyType.type
                : ''
          },
          reminderList: transportData.reminderList
            ? transportData.reminderList
            : []
        }
      }
      if (component === 'Appointment') {
        url = `${BASE_URL}${UPDATE_TRANSPORTATION}`
        dataObject.transportation.appointment = { id: appointmentId }
      } else {
        url = `${BASE_URL}${UPDATE_TRANSPORTATION_EVENT}`
        dataObject.transportation.event = { id: appointmentId }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    createUpdateTransportation(url, dataObject)
  }
  const onSelection = (date: any) => {
    selectedDate = date
    console.log('selectedDate', selectedDate)
  }
  async function setSelectedCountryChange(value: any) {
    let countryId = staticData.countryList[value].id
      ? staticData.countryList[value].id
      : 101
    await getStates(countryId)
  }
  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A] ml-2'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
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
          <Typography className={valueStyle}>{value}</Typography>
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
    <View className="my-2 my-5 w-[90%] self-center rounded-[15px] bg-[#f4ecf7] py-5">
      <PtsLoader loading={isLoading} />
      <ScrollView className="my-2 w-full">
        {_.isEmpty(transportData) ? (
          <View>
            <View className="w-full flex-row justify-center">
              <ControlledDropdown
                control={control}
                name="member"
                label="Acompany by*"
                className="w-[95%] bg-white"
                maxHeight={300}
                list={memberList}
                // onChangeValue={setSelectedCountryChange}
              />
            </View>
            <View className="my-2">
              <PtsDateTimePicker
                currentData={
                  transportData.date ? transportData.date : new Date()
                }
                onSelection={onSelection}
              />
            </View>

            <View className="my-2 w-full flex-row justify-center gap-2">
              <ControlledTextField
                control={control}
                name="description"
                placeholder={'Description'}
                className="w-[95%] bg-white"
                autoCapitalize="none"
              />
            </View>
            <View className="my-2 w-full flex-row justify-center gap-2">
              <ControlledTextField
                control={control}
                name="addressLine"
                placeholder={'Address Line'}
                className="w-[95%] bg-white"
                autoCapitalize="none"
              />
            </View>
            <View className="my-2 w-full flex-row justify-center">
              <ControlledDropdown
                control={control}
                name="country"
                label="Country*"
                className="w-[95%] bg-white"
                maxHeight={300}
                list={countryList}
                onChangeValue={setSelectedCountryChange}
              />
            </View>
            <View className="my-2 w-full flex-row justify-center">
              <ControlledDropdown
                control={control}
                name="state"
                label="State*"
                className="w-[95%] bg-white"
                maxHeight={300}
                list={statesList}
                // onChangeValue={setSelectedCountryChange}
              />
            </View>
            <View className="my-2 w-full flex-row justify-center gap-2">
              <ControlledTextField
                control={control}
                name="city"
                placeholder={'City'}
                className="w-[95%] bg-white"
                autoCapitalize="none"
              />
            </View>
            <View className=" w-full flex-row justify-center gap-2">
              <ControlledTextField
                control={control}
                name="postalCode"
                placeholder={'Zip Code'}
                className="w-[95%] bg-white"
                autoCapitalize="none"
              />
            </View>
          </View>
        ) : (
          <View>
            {getDetailsView(
              'Acompany',
              transportData.accompanyName ? transportData.accompanyName : '',
              false,
              ''
            )}
            <View className="my-2">
              <PtsDateTimePicker
                currentData={
                  transportData.date ? transportData.date : new Date()
                }
                onSelection={onSelection}
              />
            </View>
            {getDetailsView(
              'Description',
              transportData.description ? transportData.description : '',
              false,
              ''
            )}
            {getDetailsView(
              'Address',
              transportData.address
                ? getAddressFromObject(transportData.address)
                : '',
              false,
              ''
            )}
          </View>
        )}

        <View className="mt-5 flex-row justify-center">
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
            title={_.isEmpty(transportData) ? 'Send Request' : 'Save'}
            variant="default"
            onPress={handleSubmit(createUpdateTransport)}
          />
        </View>
      </ScrollView>
    </View>
  )
}
