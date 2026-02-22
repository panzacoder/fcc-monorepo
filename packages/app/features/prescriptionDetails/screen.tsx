'use client'

import { useState, useEffect, useRef } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { usePrescription, useDeletePrescription } from 'app/data/prescriptions'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getFullDateForCalendar } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useAppSelector } from 'app/redux/hooks'

export function PrescriptionDetailsScreen() {
  const prescriptionPrivilegesRef = useRef<any>({})
  const router = useRouter()
  const [prescriptionDetails, setPrescriptionDetails] = useState({}) as any
  const header = useAppSelector((state) => state.headerState.header)
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let prescriptionData =
    item.prescriptionDetails && item.prescriptionDetails !== undefined
      ? JSON.parse(item.prescriptionDetails)
      : {}

  const prescriptionId = prescriptionData.id ? prescriptionData.id : ''
  const memberId = memberData.member ? memberData.member : ''

  const { data: prescriptionQueryData, isLoading: isDetailsLoading } =
    usePrescription(header, { id: prescriptionId, memberId })

  const deletePrescriptionMutation = useDeletePrescription(header)

  useEffect(() => {
    if (prescriptionQueryData) {
      const data = prescriptionQueryData as any
      if (data.domainObjectPrivileges) {
        prescriptionPrivilegesRef.current = data.domainObjectPrivileges.Medicine
          ? data.domainObjectPrivileges.Medicine
          : {}
      }
      setPrescriptionDetails(data.medicine ? data.medicine : {})
    }
  }, [prescriptionQueryData])

  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/prescriptionsList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  let prescribedDate = '',
    startDate = '',
    endDate = '',
    status = '',
    type = '',
    drugName = '',
    strength = '',
    prescribedBy = '',
    pharmacy = '',
    instructions = '',
    note = ''
  if (!_.isEmpty(prescriptionDetails)) {
    if (prescriptionDetails.prescribedDate) {
      prescribedDate = getFullDateForCalendar(
        prescriptionDetails.prescribedDate,
        'MMM DD, YYYY'
      )
    }
    if (prescriptionDetails.startDate) {
      startDate = getFullDateForCalendar(
        prescriptionDetails.startDate,
        'MMM DD, YYYY'
      )
    }
    if (prescriptionDetails.endDate) {
      endDate = getFullDateForCalendar(
        prescriptionDetails.endDate,
        'MMM DD, YYYY'
      )
    }

    if (prescriptionDetails.type) {
      type = prescriptionDetails.type.type ? prescriptionDetails.type.type : ''
    }
    if (prescriptionDetails.name) {
      drugName = prescriptionDetails.name
    }
    if (prescriptionDetails.strength) {
      strength = prescriptionDetails.strength
    }
    if (prescriptionDetails.doctorName) {
      prescribedBy = prescriptionDetails.doctorName
    }
    if (prescriptionDetails.pharmacy) {
      pharmacy = prescriptionDetails.pharmacy
    }
    if (prescriptionDetails.status) {
      status = prescriptionDetails.status.status
        ? prescriptionDetails.status.status
        : ''
    }
    if (prescriptionDetails.instructions) {
      instructions = prescriptionDetails.instructions
    }
    if (prescriptionDetails.notes) {
      note = prescriptionDetails.notes
    }
  }
  let titleStyle = 'font-400 w-[40%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[55%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          {title !== 'Status' ? (
            <Typography className={valueStyle}>{value}</Typography>
          ) : (
            <Typography
              className={`font-400 ml-2 rounded-[5px] ${value === 'Active' ? 'bg-[#4DA529]' : 'bg-[#5778ad]'} px-2 py-1 text-[15px] font-bold text-white`}
            >
              {value}
            </Typography>
          )}
        </View>
      </View>
    )
  }

  async function deletePrescription() {
    deletePrescriptionMutation.mutate(
      {
        id: prescriptionDetails.id ? prescriptionDetails.id : '',
        memberId: memberData.id ? memberData.id : ''
      },
      {
        onSuccess: () => {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/prescriptionsList', {
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete prescription')
        }
      }
    )
  }

  return (
    <View className="flex-1">
      <PtsLoader
        loading={isDetailsLoading || deletePrescriptionMutation.isPending}
      />
      <PtsBackHeader title="Prescription Details" memberData={memberData} />
      <View className=" h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className="w-full">
              <View className="flex-row">
                <View className="w-[75%]" />
                {getUserPermission(prescriptionPrivilegesRef.current)
                  .updatePermission ? (
                  <Button
                    className=""
                    title="Edit"
                    variant="border"
                    onPress={() => {
                      router.push(
                        formatUrl('/circles/addEditPrescription', {
                          memberData: JSON.stringify(memberData),
                          prescriptionDetails:
                            JSON.stringify(prescriptionDetails)
                        })
                      )
                      // setIsAddPrescription(true)
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>

              {getDetailsView('Type', type)}
              {getDetailsView('Drug Name', drugName)}
              {getDetailsView('Strength', strength)}
              {getDetailsView('Prescribed By', prescribedBy)}
              {getDetailsView('Pharmacy', pharmacy)}
              {getDetailsView('Date Prescribed', prescribedDate)}
              {getDetailsView('Start Date', startDate)}
              {getDetailsView('End Date', endDate)}
              {getDetailsView('Instructions', instructions)}
              {getDetailsView('Note', note)}
              {getDetailsView('Status', status)}
            </View>
          </View>

          {getUserPermission(prescriptionPrivilegesRef.current)
            .deletePermission ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Prescriptions?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deletePrescription()
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
        </ScrollView>
      </View>
    </View>
  )
}
