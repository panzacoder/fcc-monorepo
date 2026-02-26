import { useState, useEffect, useRef } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { getAddressFromObject, isEmpty } from 'app/ui/utils'
import PtsLoader from 'app/ui/PtsLoader'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { useAppSelector } from 'app/store'
import { Button } from 'app/ui/button'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { logger } from 'app/utils/logger'
import {
  useTransportationMemberList,
  useCreateTransportation,
  useCreateTransportationEvent,
  useUpdateTransportation,
  useUpdateTransportationEvent
} from 'app/data/transportation'
import { useStatesAndTimezones } from 'app/data/locations'
import type { Address, Country, State, AccompanyType } from 'app/data/types.d'
import type { TransportationData } from 'app/data/transportation/types'
import type { ComponentProps } from 'react'
import type { Feather as FeatherType } from 'app/ui/icons'
import type { DropdownItem } from 'app/ui/PtsDropdown'

interface TransportDisplayData extends Partial<TransportationData> {
  accompanyName?: string
  accompanyType?: Partial<AccompanyType>
  status?: { status?: string }
}

interface AddEditTransportProps {
  component: string
  address: Partial<Address> & {
    state?: Partial<State> & { country?: Partial<Country> }
  }
  transportData: TransportDisplayData
  date: Date | string
  appointmentId: number | string
  cancelClicked: () => void
}

interface StaticData {
  countryList: Country[]
}

interface MemberListItem {
  name: string
  id: number
  memberId: number | string
}

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
  cancelClicked
}: AddEditTransportProps) => {
  logger.debug('address', JSON.stringify(address))
  const header = useAppSelector((state) => state.headerState.header)
  const user = useAppSelector((state) => state.userProfileState.header)
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  const [selectedDate, setSelectedDate] = useState(
    !isEmpty(transportData)
      ? new Date(transportData.date ?? new Date())
      : new Date(date)
  )
  const [key, setKey] = useState(0)
  const [memberList, setMemberList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const [memberListFull, setMemberListFull] = useState<MemberListItem[]>([])
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  ) as Partial<Address> & {
    state: Partial<State> & { country: Partial<Country> }
  }
  const countryIndexRef = useRef(-1)
  const stateIndexRef = useRef(-1)
  const [selectedCountryId, setSelectedCountryId] = useState(101)

  const memberListQuery = useTransportationMemberList(header, {
    memberId: user.memberId ? user.memberId : ''
  })

  const statesQuery = useStatesAndTimezones(header, {
    countryId: selectedCountryId
  })

  useEffect(() => {
    if (!Array.isArray(memberListQuery.data) || !isEmpty(transportData)) return
    const list: Array<{ id: number; title: string }> = memberListQuery.data.map(
      (item: MemberListItem, index: number) => {
        return {
          title: item.name,
          id: index + 1
        }
      }
    )
    setMemberList(list)
    setMemberListFull((memberListQuery.data as MemberListItem[]) || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberListQuery.data])

  useEffect(() => {
    if (!statesQuery.data) return
    let stateName = ''
    if (!isEmpty(address)) {
      stateName = address.state?.name ? address.state.name : ''
    } else {
      if (!isEmpty(memberAddress) && isEmpty(transportData)) {
        stateName = memberAddress.state.name ? memberAddress.state.name : ''
      }
    }

    let statesList: Array<{ id: number; title: string }> = []
    statesQuery.data.stateList.map(({ name }: State, index: number) => {
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
    setStatesListFull(statesQuery.data.stateList || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statesQuery.data])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: '',
      member: isEmpty(transportData) ? -1 : 1,
      addressLine: !isEmpty(address) && address.line ? address.line : '',
      state: isEmpty(transportData) ? stateIndexRef.current : 1,
      country: isEmpty(transportData) ? countryIndexRef.current : 1,
      city: !isEmpty(address) && address.city ? address.city : '',
      postalCode: !isEmpty(address) && address.zipCode ? address.zipCode : ''
    },
    resolver: zodResolver(schema)
  })
  const [statesList, setStatesList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const [statesListFull, setStatesListFull] = useState<State[]>([])
  let countryName = ''
  if (!isEmpty(address)) {
    countryName = address.state?.country?.name ? address.state.country.name : ''
  } else {
    if (!isEmpty(memberAddress) && isEmpty(transportData)) {
      countryName = memberAddress.state.country.name
        ? memberAddress.state.country.name
        : ''
    }
  }
  const countryList: Array<{ id: number; title: string }> = []
  staticData.countryList.map(({ name }: Country, index: number) => {
    if (name === countryName) {
      countryIndexRef.current = index + 1
    }
    let object = {
      title: name,
      id: index + 1
    }
    countryList.push(object)
  })

  const createTransportationMutation = useCreateTransportation(header)
  const createTransportationEventMutation = useCreateTransportationEvent(header)
  const updateTransportationMutation = useUpdateTransportation(header)
  const updateTransportationEventMutation = useUpdateTransportationEvent(header)

  const isLoading =
    memberListQuery.isLoading ||
    statesQuery.isLoading ||
    createTransportationMutation.isPending ||
    createTransportationEventMutation.isPending ||
    updateTransportationMutation.isPending ||
    updateTransportationEventMutation.isPending

  async function createUpdateTransport(formData: Schema) {
    if (isEmpty(transportData)) {
      let stateObject = statesListFull[formData.state - 1]
      let countryObject: object =
        staticData.countryList[formData.country - 1] ?? {}

      let transportAddress = {
        line: formData.addressLine,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
      let transportPayload: TransportationData = {
        date: selectedDate,
        description: formData.description,
        accompany: memberListFull[formData.member - 1]?.memberId
          ? memberListFull[formData.member - 1]!.memberId
          : '',
        accompanyType: {
          type: 'Family Member'
        },
        reminderList: [],
        address: {
          ...transportAddress,
          state: { ...transportAddress.state, country: countryObject }
        }
      }
      if (component === 'Appointment') {
        transportPayload.appointment = { id: appointmentId }
        createTransportationMutation.mutate(
          { transportation: transportPayload },
          {
            onSuccess: () => {
              cancelClicked()
            },
            onError: (error) => {
              Alert.alert(
                '',
                error.message || 'Failed to create transportation'
              )
            }
          }
        )
      } else {
        transportPayload.event = { id: appointmentId }
        createTransportationEventMutation.mutate(
          { transportation: transportPayload },
          {
            onSuccess: () => {
              cancelClicked()
            },
            onError: (error) => {
              Alert.alert(
                '',
                error.message || 'Failed to create transportation'
              )
            }
          }
        )
      }
    } else {
      let transportPayload: TransportationData = {
        id: transportData.id ? transportData.id : '',
        date: selectedDate,
        description: transportData.description ? transportData.description : '',
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
      if (component === 'Appointment') {
        transportPayload.appointment = { id: appointmentId }
        updateTransportationMutation.mutate(
          { transportation: transportPayload },
          {
            onSuccess: () => {
              cancelClicked()
            },
            onError: (error) => {
              Alert.alert(
                '',
                error.message || 'Failed to update transportation'
              )
            }
          }
        )
      } else {
        transportPayload.event = { id: appointmentId }
        updateTransportationEventMutation.mutate(
          { transportation: transportPayload },
          {
            onSuccess: () => {
              cancelClicked()
            },
            onError: (error) => {
              Alert.alert(
                '',
                error.message || 'Failed to update transportation'
              )
            }
          }
        )
      }
    }
  }
  const onSelection = (date: Date) => {
    setSelectedDate(date)
    setKey(Math.random())
  }

  async function setSelectedCountryChange(value: DropdownItem) {
    if (value) {
      const idx = Number(value.id) - 1
      let countryId = staticData.countryList[idx]?.id
        ? staticData.countryList[idx]!.id
        : 101
      setSelectedCountryId(countryId)
    }
  }
  let titleStyle = 'font-normal w-[30%] text-[15px] text-[#1A1A1A] ml-2'
  let valueStyle = 'font-normal ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(
    title: string,
    value: string,
    isIcon: boolean,
    iconValue?: ComponentProps<typeof FeatherType>['name']
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
        {isIcon && iconValue ? (
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
      <Typography className="self-center font-bold">{`${isEmpty(transportData) ? 'Add ' : 'Edit '} ${component} Transportation`}</Typography>
      <SafeAreaView>
        <ScrollView className="my-2 w-full">
          {isEmpty(transportData) ? (
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
                false
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
                false
              )}
              {getDetailsView(
                'Address',
                transportData.address
                  ? getAddressFromObject(transportData.address)
                  : '',
                false
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
              title={isEmpty(transportData) ? 'Send Request' : 'Save'}
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
