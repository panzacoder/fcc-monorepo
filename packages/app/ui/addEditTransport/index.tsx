import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { CallPostService } from 'app/utils/fetchServerData'
import { getAddressFromObject } from 'app/ui/utils'
import PtsLoader from 'app/ui/PtsLoader'
import { SafeAreaView } from 'app/ui/safe-area-view'
import {
  BASE_URL,
  GET_TRANSPORTATION_MEMBER_LIST,
  GET_STATES_AND_TIMEZONES,
  CREATE_TRANSPORTATION,
  CREATE_TRANSPORTATION_EVENT,
  UPDATE_TRANSPORTATION,
  UPDATE_TRANSPORTATION_EVENT
} from 'app/utils/urlConstants'
import { useAppSelector } from 'app/redux/hooks'
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
import { logger } from 'app/utils/logger'
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
export const AddEditTransport = ({
  component,
  address,
  transportData,
  date,
  appointmentId,
  cancelClicked,
  createUpdateTransportation
}) => {
  logger.debug('address', JSON.stringify(address))
  const header = useAppSelector((state) => state.headerState.header)
  const user = useAppSelector((state) => state.userProfileState.header)
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const [isLoading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    !_.isEmpty(transportData) ? new Date(transportData.date) : new Date(date)
  )
  const [key, setKey] = useState(0)
  const [memberList, setMemberList] = useState([]) as any
  const [memberListFull, setMemberListFull] = useState([]) as any
  const memberAddress: any = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const countryIndexRef = useRef(-1)
  const stateIndexRef = useRef(-1)
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
            let list: Array<{ id: number; title: string }> = data.data.map(
              ({ name, id }: Response, index: any) => {
                return {
                  title: name,
                  id: index + 1
                }
              }
            )
            setMemberList(list)
            await setMemberListFull(data.data || [])
            // console.log('setMemberListFull', JSON.stringify(memberListFull))
          } else {
            Alert.alert('', data.message)
          }
        })
        .catch((error) => {
          setLoading(false)
          logger.debug(error)
        })
    }
    if (_.isEmpty(transportData)) {
      getMemberList()
    }
    getStates(101)
  }, [])

  const { control, handleSubmit, reset } = useForm({
    //some default data has been set for required fields in case of update
    defaultValues: {
      description: '',
      member: _.isEmpty(transportData) ? -1 : 1,
      addressLine: !_.isEmpty(address) && address.line ? address.line : '',
      state: _.isEmpty(transportData) ? stateIndexRef.current : 1,
      country: _.isEmpty(transportData) ? countryIndexRef.current : 1,
      city: !_.isEmpty(address) && address.city ? address.city : '',
      postalCode: !_.isEmpty(address) && address.zipCode ? address.zipCode : ''
    },
    resolver: zodResolver(schema)
  })
  const [statesList, setStatesList] = useState([]) as any
  const [statesListFull, setStatesListFull] = useState([])
  type Response = {
    id: number
    name: string
  }
  let countryName = ''
  if (!_.isEmpty(address)) {
    countryName = address.state.country.name ? address.state.country.name : ''
  } else {
    if (!_.isEmpty(memberAddress) && _.isEmpty(transportData)) {
      countryName = memberAddress.state.country.name
        ? memberAddress.state.country.name
        : ''
    }
  }
  const countryList: Array<{ id: number; title: string }> = []
  staticData.countryList.map(({ name, id }: Response, index: any) => {
    if (name === countryName) {
      countryIndexRef.current = index + 1
    }
    let object = {
      title: name,
      id: index + 1
    }
    countryList.push(object)
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
          let stateName = ''
          if (!_.isEmpty(address)) {
            stateName = address.state.name ? address.state.name : ''
          } else {
            if (!_.isEmpty(memberAddress) && _.isEmpty(transportData)) {
              stateName = memberAddress.state.name
                ? memberAddress.state.name
                : ''
            }
          }

          let statesList: Array<{ id: number; title: string }> = []
          data.data.stateList.map(({ name, id }: Response, index: any) => {
            if (name === stateName) {
              stateIndexRef.current = index + 1
              reset({
                country: countryIndexRef.current,
                state: stateIndexRef.current
              })
            }
            let object = {
              title: name,
              id: index + 1
            }
            statesList.push(object)
          })

          setStatesList(statesList)
          setStatesListFull(data.data.stateList || [])
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }, [])

  async function createUpdateTransport(formData: Schema) {
    let dataObject = {} as any
    let url = ''
    if (_.isEmpty(transportData)) {
      let stateObject = statesListFull[formData.state - 1]
      let countryObject: object = staticData.countryList[formData.country - 1]

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
          accompany: memberListFull[formData.member - 1].memberId
            ? memberListFull[formData.member - 1].memberId
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
    setSelectedDate(date)
    setKey(Math.random())
    // console.log('selectedDate', '' + selectedDate)
  }

  async function setSelectedCountryChange(value: any) {
    if (value) {
      let countryId = staticData.countryList[value.id - 1].id
        ? staticData.countryList[value.id - 1].id
        : 101
      await getStates(countryId)
    }
    //  else {
    //   reset({
    //     country: -1
    //   })
    //   setStatesList([])
    //   setStatesListFull([])
    // }
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
    <View
      key={key}
      className="my-5 mt-0 h-[90%] w-[90%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-[#f4ecf7] py-5"
    >
      <PtsLoader loading={isLoading} />
      <Typography className="self-center font-bold">{`${_.isEmpty(transportData) ? 'Add ' : 'Edit '} ${component} Transportation`}</Typography>
      <SafeAreaView>
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
                />
              </View>
              <View className="my-2 w-[95%] self-center">
                <PtsDateTimePicker
                  currentData={selectedDate}
                  onSelection={onSelection}
                />
              </View>

              <View className="my-2 w-full flex-row justify-center gap-2">
                <ControlledTextField
                  control={control}
                  name="description"
                  placeholder={'Description'}
                  className="w-[95%] bg-white"
                />
              </View>
              <View className="my-2 w-full flex-row justify-center gap-2">
                <ControlledTextField
                  control={control}
                  name="addressLine"
                  placeholder={'Address Line'}
                  className="w-[95%] bg-white"
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
                />
              </View>
              <View className="my-2 w-full flex-row justify-center gap-2">
                <ControlledTextField
                  control={control}
                  name="city"
                  placeholder={'City'}
                  className="w-[95%] bg-white"
                />
              </View>
              <View className=" w-full flex-row justify-center gap-2">
                <ControlledTextField
                  control={control}
                  name="postalCode"
                  placeholder={'Zip Code'}
                  className="w-[95%] bg-white"
                  keyboard={'number-pad'}
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
              <View className="my-2 w-[95%] self-center">
                <PtsDateTimePicker
                  currentData={selectedDate}
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
              leadingIcon="x"
              onPress={() => {
                cancelClicked()
              }}
            />
            <Button
              className="ml-5"
              title={_.isEmpty(transportData) ? 'Send Request' : 'Save'}
              variant="default"
              leadingIcon="save"
              onPress={handleSubmit(createUpdateTransport)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
