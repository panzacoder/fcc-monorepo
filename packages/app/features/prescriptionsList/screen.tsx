'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_PRESCRIPTION_LIST,
  GET_PHARMACY_LIST,
  GET_ACTIVE_DOCTORS,
  CREATE_PRESCRIPTION
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { AddEditPrescription } from 'app/ui/addEditPrescription'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { Button } from 'app/ui/button'
import { getFullDateForCalendar } from 'app/ui/utils'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({
  typeIndex: z.number(),
  prescribedIndex: z.number(),
  pharmacyIndex: z.number(),
  drugName: z.string()
})
let prescriptionPrivileges = {}
let selectedType = 'All'
let selectedPrescriber = 'All'
let selectedPharmacy = 'All'
let drugName = ''
export type Schema = z.infer<typeof schema>
export function PrescriptionsListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [prescriptionList, setPrescriptionList] = useState([]) as any
  const [pharmacyList, setPharmacyList] = useState([]) as any
  const [pharmacyListFull, setPharmacyListFull] = useState([]) as any
  const [doctorList, setDoctorList] = useState([]) as any
  const [doctorListFull, setDoctorListFull] = useState([]) as any
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isAddPrescription, setIsAddPrescription] = useState(false)
  const [prescriptionListFull, setPrescriptionListFull] = useState([]) as any
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('Active')
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()

  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  const staticData: any = store.getState().staticDataState.staticData

  //we have to add 'All' type in some list and dropdown is not working for 0 as id, so we started id from 1
  type TypeResponse = {
    id: number
    type: string
  }
  let typesList: Array<{ id: number; title: string }> = [
    { id: 1, title: 'All' }
  ]
  staticData.medicineTypeList.map(({ type, id }: TypeResponse, index: any) => {
    typesList.push({
      id: index + 2,
      title: type
    })
  })
  // console.log('typesList', JSON.stringify(typesList))
  const getPrescriptionList = useCallback(async (isFromFilter: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_PRESCRIPTION_LIST}`
    let dataObject: any = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      }
    }
    if (isFromFilter) {
      dataObject.name = drugName
      dataObject.pharmacy = selectedPharmacy
      dataObject.prescribedBy = selectedPrescriber
      dataObject.type = {
        type: selectedType
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (data.data.domainObjectPrivileges) {
            prescriptionPrivileges = data.data.domainObjectPrivileges.Medicine
              ? data.data.domainObjectPrivileges.Medicine
              : {}
          }
          let list = data.data.medicineList ? data.data.medicineList : []
          setPrescriptionList(list)
          setPrescriptionListFull(list)
          setIsDataReceived(true)
          getFilteredList(list, currentFilter)
          setIsFilter(false)
          setIsAddPrescription(false)
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
          // let pharmacyList: object[] = [{ title: 'All', id: 0 }]

          //we have to add 'All' type in some list and dropdown is not working for 0 as id, so we started id from 1
          let pharmacyList: Array<{ id: number; title: string }> = [
            { id: 1, title: 'All' }
          ]
          list.map((data: any, index: any) => {
            let object = {
              title: data.name,
              id: index + 2
            }
            pharmacyList.push(object)
          })
          setPharmacyList(pharmacyList)
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
          // let doctorList: object[] = [{ title: 'All', id: 0 }]
          //we have to add 'All' type in some list and dropdown is not working for 0 as id, so we started id from 1
          let doctorList: Array<{ id: number; title: string }> = [
            { id: 1, title: 'All' }
          ]
          list.map((data: any, index: any) => {
            let object = {
              title: data.name,
              id: index + 2
            }
            doctorList.push(object)
          })
          setDoctorList(doctorList)
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
    getPrescriptionList(false)
    getPharmacyList()
    getActiveDoctorsList()
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(prescriptionListFull, filter)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    list.map((data: any, index: any) => {
      let type = data.type && data.type.type ? data.type.type : ''
      if (filter === 'All') {
        filteredList = list
      } else if (filter === data.status) {
        filteredList.push(data)
      }
    })
    setPrescriptionList(filteredList)
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      typeIndex: 1,
      prescribedIndex: 1,
      pharmacyIndex: 1,
      drugName: ''
    },
    resolver: zodResolver(schema)
  })

  function filterPrescriptions(formData: Schema) {
    drugName = formData.drugName
    if (formData.typeIndex !== 1) {
      selectedType = staticData.medicineTypeList[formData.typeIndex - 2].type
    } else {
      selectedType = 'All'
    }

    selectedPharmacy = pharmacyList[formData.pharmacyIndex - 1].title

    if (formData.prescribedIndex !== 1) {
      selectedPrescriber = doctorListFull[formData.prescribedIndex - 2]
    } else {
      selectedPrescriber = 'All'
    }
    getPrescriptionList(true)
  }
  function resetFilter() {
    getPrescriptionList(false)
    reset({
      typeIndex: 1,
      prescribedIndex: 1,
      pharmacyIndex: 1,
      drugName: ''
    })
  }
  const cancelClicked = () => {
    setIsAddPrescription(false)
  }
  async function createUpdatePrescription(object: any) {
    let doctorId = ''
    let facilityId = ''
    if (object.prescribedBy !== '') {
      doctorListFull.map((data: any, index: any) => {
        if (data.name === object.prescribedBy) {
          doctorId = data.id
        }
      })
    }
    if (object.selectedPharmacy !== '') {
      pharmacyListFull.map((data: any, index: any) => {
        if (data.name === object.selectedPharmacy) {
          facilityId = data.id
        }
      })
    }
    setLoading(true)
    let url = `${BASE_URL}${CREATE_PRESCRIPTION}`
    let dataObject = {
      header: header,
      medicine: {
        name: object.drugName ? object.drugName : '',
        prescribedDate: object.prescribedDate ? object.prescribedDate : '',
        startDate: object.startDate ? object.startDate : '',
        endDate: object.endDate ? object.endDate : '',
        instructions: object.instructions ? object.instructions : '',
        notes: object.notes ? object.notes : '',
        pharmacy: object.selectedPharmacy ? object.selectedPharmacy : '',
        doctorName: object.prescribedBy ? object.prescribedBy : '',
        facilityid: facilityId,
        doctorid: doctorId,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        type: {
          id: object.type ? object.type : ''
        }
      }
    }
    console.log('in createUpdatePrescription', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          getPrescriptionList(false)
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
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        {!isAddPrescription ? (
          <View className="w-full flex-row">
            <View className="min-w-[75%]">
              <TouchableOpacity
                onPress={() => {
                  setIsShowFilter(!isShowFilter)
                }}
                className=" flex-row"
              >
                <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
                  {currentFilter}
                </Typography>
                <Feather
                  className="ml-2 mt-6"
                  name={!isShowFilter ? 'chevron-down' : 'chevron-up'}
                  size={25}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            {getUserPermission(prescriptionPrivileges).createPermission ? (
              <View className=" mt-[20] self-center">
                <TouchableOpacity
                  className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                  onPress={() => {
                    // router.push(
                    //   formatUrl('/circles/addEditDoctor', {
                    //     memberData: JSON.stringify(memberData)
                    //   })
                    // )
                    setIsAddPrescription(true)
                  }}
                >
                  <Feather name={'plus'} size={25} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
            <View className="mt-5 self-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowFilter(false)
                  setIsFilter(!isFilter)
                }}
                className="ml-5 h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-[#c5dbfd]"
              >
                <Feather
                  className=""
                  name={'filter'}
                  size={25}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
      {isFilter ? (
        <View className="mt-2 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="All"
              maxHeight={300}
              list={typesList}
              className="w-[45%]"
              defaultValue="All"
            />
            <ControlledTextField
              control={control}
              name="drugName"
              placeholder={'Drug Name'}
              className="ml-5 h-[25%] w-[45%]"
              autoCapitalize="none"
            />
          </View>
          <View className=" w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="prescribedIndex"
              label="All"
              maxHeight={300}
              list={doctorList}
              className="w-[45%]"
              defaultValue="All"
            />
            <ControlledDropdown
              control={control}
              name="pharmacyIndex"
              label="All"
              maxHeight={300}
              list={pharmacyList}
              className="ml-5 w-[45%]"
              defaultValue="All"
            />
          </View>
          <View className="flex-row self-center">
            <View className="mt-2 flex-row justify-center ">
              <Button
                className="bg-[#287CFA]"
                title={''}
                leadingIcon="filter"
                variant="default"
                onPress={handleSubmit(filterPrescriptions)}
              />
              <Button
                className="mx-3 bg-[#287CFA]"
                title={''}
                leadingIcon="rotate-ccw"
                variant="default"
                onPress={() => {
                  resetFilter()
                }}
              />
              <Button
                className=" bg-[#287CFA]"
                title={''}
                leadingIcon="x"
                variant="default"
                onPress={() => {
                  setIsFilter(!isFilter)
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <TouchableOpacity
            className={`${currentFilter === 'Active' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Active')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Active'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'NotTaking' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('NotTaking')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Not Taking'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      {isDataReceived && prescriptionList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} prescriptions`}</Typography>
        </View>
      ) : (
        <View />
      )}
      <ScrollView className="m-2 mx-2 w-full self-center">
        {prescriptionList.map((data: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.replace(
                  formatUrl('/circles/prescriptionDetails', {
                    prescriptionDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="w-[95%] flex-row">
                <View>
                  <View className="my-1 flex-row">
                    <Typography className="text-primary font-400 ml-5 w-[40%]">
                      {data.type ? data.type : ''}
                    </Typography>

                    <Typography className="ml-5 mr-5 w-[45%] text-right">
                      {data.name ? data.name : ''}
                    </Typography>
                  </View>
                  {data.doctorname || data.pharmacy ? (
                    <View className="flex-row">
                      <Typography className="text-primary font-400 ml-5 w-[40%]">
                        {data.doctorname ? data.doctorname : ''}
                      </Typography>

                      <Typography className="ml-5 mr-5 w-[45%] text-right">
                        {data.pharmacy ? data.pharmacy : ''}
                      </Typography>
                    </View>
                  ) : (
                    <View />
                  )}

                  <View className="flex-row">
                    <View className="w-[95%] flex-row">
                      <Typography className="ml-5 text-[#4DA529]">
                        {data.startDate
                          ? getFullDateForCalendar(
                              data.startDate,
                              'MMM DD, YYYY'
                            )
                          : ''}
                      </Typography>
                      <Typography className="text-[#ef6603]">
                        {data.endDate
                          ? ' - ' +
                            getFullDateForCalendar(data.endDate, 'MMM DD, YYYY')
                          : ''}
                      </Typography>
                    </View>
                  </View>
                </View>
                <View className=" ml-[-10] self-center">
                  <Feather name={'chevron-right'} size={20} color={'black'} />
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      {isAddPrescription ? (
        <View className="h-full w-full ">
          <AddEditPrescription
            prescriptionDetails={{}}
            cancelClicked={cancelClicked}
            createUpdatePrescription={createUpdatePrescription}
            activeDoctorList={doctorListFull}
            pharmacyList={pharmacyListFull}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
