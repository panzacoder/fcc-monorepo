'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_PRESCRIPTION,
  DELETE_PRESCRIPTION,
  GET_PHARMACY_LIST,
  GET_ACTIVE_DOCTORS
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getFullDateForCalendar } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'

let prescriptionPrivileges = {}
export function PrescriptionDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [pharmacyListFull, setPharmacyListFull] = useState([]) as any
  const [doctorListFull, setDoctorListFull] = useState([]) as any
  const [prescriptionDetails, setPrescriptionDetails] = useState({}) as any
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let prescriptionData =
    item.prescriptionDetails && item.prescriptionDetails !== undefined
      ? JSON.parse(item.prescriptionDetails)
      : {}
  // console.log('prescriptionDetails', JSON.stringify(prescriptionDetails))
  const getPrescriptionDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_PRESCRIPTION}`
    let dataObject = {
      header: header,
      medicine: {
        id: prescriptionData.id ? prescriptionData.id : '',
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('data', JSON.stringify(data.data))
          if (data.data.domainObjectPrivileges) {
            prescriptionPrivileges = data.data.domainObjectPrivileges.Medicine
              ? data.data.domainObjectPrivileges.Medicine
              : {}
          }
          setPrescriptionDetails(data.data.medicine ? data.data.medicine : {})
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  const getPharmacyList = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_PHARMACY_LIST}`
    let dataObject = {
      header: header,
      facility: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let list = data.data.list ? data.data.list : []
          setPharmacyListFull(list)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  const getActiveDoctorsList = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_ACTIVE_DOCTORS}`
    let dataObject = {
      header: header,
      doctor: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let list = data.data.doctorList ? data.data.doctorList : []
          setDoctorListFull(list)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getPrescriptionDetails()
    getActiveDoctorsList()
    getPharmacyList()
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
    setLoading(true)
    let url = `${BASE_URL}${DELETE_PRESCRIPTION}`
    let dataObject = {
      header: header,
      medicine: {
        id: prescriptionDetails.id ? prescriptionDetails.id : '',
        member: {
          id: memberData.id ? memberData.id : ''
        }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          router.dismiss(2)
          router.push(
            formatUrl('/circles/prescriptionsList', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className="w-full">
              <View className="flex-row">
                <View className="w-[75%]" />
                {getUserPermission(prescriptionPrivileges).updatePermission ? (
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

          {getUserPermission(prescriptionPrivileges).deletePermission ? (
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
