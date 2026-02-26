import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Transportation } from 'app/ui/transportation'
import { AddEditTransport } from 'app/ui/addEditTransport'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useModal } from 'app/utils/useModal'
import { isAfter } from 'date-fns'
import type { ComponentProps } from 'react'
import type { PrivilegeAction } from 'app/data/types.d'
import type { EventDetailsHookReturn } from '../hooks/useEventDetailsData'

type TransportationDisplayData = ComponentProps<typeof Transportation>['data']
type TransportDisplayData = ComponentProps<
  typeof AddEditTransport
>['transportData']

interface EventTransportationSectionProps {
  eventId: number | string
  eventDate: string | Date
  transportationList: TransportationDisplayData[]
  transportationPrivileges: PrivilegeAction[]
  address: Record<string, unknown>
  deleteTransportationMutation: EventDetailsHookReturn['deleteTransportation']
  resendTransportationMutation: EventDetailsHookReturn['resendTransportation']
  cancelTransportationMutation: EventDetailsHookReturn['cancelTransportation']
  onRefetch: () => void
}

export function EventTransportationSection({
  eventId,
  eventDate,
  transportationList,
  transportationPrivileges,
  address,
  deleteTransportationMutation,
  resendTransportationMutation,
  cancelTransportationMutation,
  onRefetch
}: EventTransportationSectionProps) {
  const transportModal = useModal<Partial<TransportDisplayData>>()
  const [isShowTransportation, setIsShowTransportation] = useState(false)

  const cancelClicked = () => {
    transportModal.close()
  }

  async function deleteResendCancelTransportation(
    count: number,
    transportData: TransportationDisplayData
  ) {
    const transportId = transportData.id ? transportData.id : ''
    const onSuccess = () => {
      onRefetch()
      setIsShowTransportation(true)
    }
    if (count === 0) {
      deleteTransportationMutation.mutate(
        { transportation: { id: transportId } },
        {
          onSuccess,
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to delete transportation')
          }
        }
      )
    } else if (count === 1) {
      resendTransportationMutation.mutate(
        { transportation: { id: transportId } },
        {
          onSuccess: () => {
            onSuccess()
            Alert.alert('', 'Request resent successfully')
          },
          onError: (error) => {
            Alert.alert(
              '',
              error.message || 'Failed to resend transportation request'
            )
          }
        }
      )
    } else {
      cancelTransportationMutation.mutate(
        { transportationVo: { id: transportId } },
        {
          onSuccess: () => {
            onSuccess()
            Alert.alert('', 'Transportation request cancelled')
          },
          onError: (error) => {
            Alert.alert(
              '',
              error.message || 'Failed to cancel transportation request'
            )
          }
        }
      )
    }
  }

  const editTransportation = (
    transportationData: TransportationDisplayData
  ) => {
    transportModal.open(transportationData as TransportDisplayData)
  }

  return (
    <>
      <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
        <View className=" w-full flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              setIsShowTransportation(!isShowTransportation)
            }}
            className="w-[50%] flex-row"
          >
            <Typography className="font-normal text-[14px] font-bold text-black">
              {'Transportation'}
              {transportationList.length > 0
                ? ' (' + transportationList.length + ') '
                : ''}
            </Typography>
            {transportationList.length > 0 ? (
              <Feather
                className=""
                name={!isShowTransportation ? 'chevron-down' : 'chevron-up'}
                size={20}
                color={'black'}
              />
            ) : (
              <View />
            )}
          </TouchableOpacity>
          {isAfter(new Date(eventDate ? eventDate : ''), new Date()) &&
          getUserPermission(transportationPrivileges).createPermission ? (
            <Button
              className=""
              title="Transportation"
              leadingIcon="plus"
              variant="border"
              onPress={() => {
                transportModal.open({} as TransportDisplayData)
              }}
            />
          ) : (
            <View />
          )}
        </View>
        {transportationList.length > 0 && isShowTransportation ? (
          <ScrollView className="">
            {transportationList.map((data, index) => {
              return (
                <View key={index}>
                  <Transportation
                    component={'Event'}
                    data={data}
                    editTransportation={editTransportation}
                    deleteResendCancelTransportation={
                      deleteResendCancelTransportation
                    }
                  />
                </View>
              )
            })}
          </ScrollView>
        ) : (
          <View />
        )}
      </View>

      {transportModal.isOpen ? (
        <View className="h-full w-full">
          <AddEditTransport
            component={'Event'}
            address={address ? address : {}}
            transportData={transportModal.data ?? ({} as TransportDisplayData)}
            date={eventDate ? eventDate : ''}
            appointmentId={eventId ?? 0}
            cancelClicked={cancelClicked}
          />
        </View>
      ) : (
        <View />
      )}
    </>
  )
}
