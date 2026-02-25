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
import type { AppointmentDetailsHookReturn } from '../hooks/useAppointmentDetailsData'

interface TransportItem {
  id: number | string
  apointmentId?: number | string
  [key: string]: unknown
}

interface AppointmentTransportationSectionProps {
  appointmentId: number | string
  appointmentDate: string | Date
  transportationList: TransportItem[]
  transportationPrivileges: PrivilegeAction[]
  address: Record<string, unknown>
  deleteTransportationMutation: AppointmentDetailsHookReturn['deleteTransportation']
  resendTransportationMutation: AppointmentDetailsHookReturn['resendTransportation']
  cancelTransportationMutation: AppointmentDetailsHookReturn['cancelTransportation']
  onRefetch: () => void
}

export function AppointmentTransportationSection({
  appointmentId,
  appointmentDate,
  transportationList,
  transportationPrivileges,
  address,
  deleteTransportationMutation,
  resendTransportationMutation,
  cancelTransportationMutation,
  onRefetch
}: AppointmentTransportationSectionProps) {
  const transportModal = useModal<Partial<TransportItem>>()
  const [isShowTransportation, setIsShowTransportation] = useState(false)

  const cancelClicked = () => {
    transportModal.close()
  }

  async function deleteResendCancelTransportation(
    count: number,
    transportData: TransportItem
  ) {
    const transportId = transportData.id ? transportData.id : ''
    if (count === 0) {
      deleteTransportationMutation.mutate(
        { transportation: { id: transportId } },
        {
          onSuccess: () => {
            onRefetch()
          },
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
            onRefetch()
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
            onRefetch()
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

  const editTransportation = (transportationData: TransportItem) => {
    transportModal.open(transportationData)
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
            <Typography className="font-400 text-[14px] font-bold text-black">
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
          {isAfter(
            new Date(appointmentDate ? appointmentDate : ''),
            new Date()
          ) && getUserPermission(transportationPrivileges).createPermission ? (
            <Button
              className=""
              title="Transportation"
              leadingIcon="plus"
              variant="border"
              onPress={() => {
                transportModal.open({})
              }}
            />
          ) : (
            <View />
          )}
        </View>
        {transportationList.length > 0 && isShowTransportation ? (
          <ScrollView className="">
            {transportationList.map((data, index) => {
              data.apointmentId = appointmentId
              return (
                <View key={index}>
                  <Transportation
                    component={'Appointment'}
                    data={data}
                    editTransportation={
                      editTransportation as ComponentProps<
                        typeof Transportation
                      >['editTransportation']
                    }
                    deleteResendCancelTransportation={
                      deleteResendCancelTransportation as unknown as ComponentProps<
                        typeof Transportation
                      >['deleteResendCancelTransportation']
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
        <View className="h-[95%] w-full">
          <AddEditTransport
            component={'Appointment'}
            address={address ? address : {}}
            transportData={transportModal.data ?? {}}
            date={appointmentDate ? appointmentDate : new Date()}
            appointmentId={appointmentId ?? ''}
            cancelClicked={cancelClicked}
          />
        </View>
      ) : (
        <View />
      )}
    </>
  )
}
