'use client'

import { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { usePrescriptionList } from 'app/data/prescriptions'
import type { PrescriptionListItem } from 'app/data/prescriptions/types'
import { usePharmacyList } from 'app/data/facilities'
import type { PharmacyListItem } from 'app/data/facilities/types'
import { useActiveDoctors } from 'app/data/doctors'
import type { ActiveDoctorItem } from 'app/data/doctors/types'
import type { MedicineType } from 'app/data/types'
import { usePermissions } from 'app/utils/usePermissions'
import type { StaticData } from 'app/data/static'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useAppSelector } from 'app/redux/hooks'
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
export type Schema = z.infer<typeof schema>
type MemberRouteParams = {
  member?: number | string
  firstname?: string
  lastname?: string
}

export function PrescriptionsListScreen() {
  const [prescriptionList, setPrescriptionList] = useState<
    PrescriptionListItem[]
  >([])
  const [pharmacyList, setPharmacyList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const [pharmacyListFull, setPharmacyListFull] = useState<PharmacyListItem[]>(
    []
  )
  const [doctorList, setDoctorList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const [doctorListFull, setDoctorListFull] = useState<ActiveDoctorItem[]>([])
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [prescriptionListFull, setPrescriptionListFull] = useState<
    PrescriptionListItem[]
  >([])
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('Active')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedPrescriber, setSelectedPrescriber] = useState('All')
  const [selectedPharmacy, setSelectedPharmacy] = useState('All')
  const [drugName, setDrugName] = useState('')
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const header = useAppSelector((state) => state.headerState.header)
  const item = useLocalSearchParams<Record<string, string>>()
  const router = useRouter()

  let memberData =
    item.memberData !== undefined
      ? (JSON.parse(item.memberData) as MemberRouteParams)
      : ({} as MemberRouteParams)
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData

  let typesList: Array<{ id: number; title: string }> = [
    { id: 1, title: 'All' }
  ]
  staticData.medicineTypeList.map(
    ({ type, id }: MedicineType, index: number) => {
      typesList.push({
        id: index + 2,
        title: type
      })
    }
  )

  const memberId = memberData.member ? memberData.member : ''

  const prescriptionParams = isFilterApplied
    ? {
        memberId,
        name: drugName || undefined,
        pharmacy: selectedPharmacy !== 'All' ? selectedPharmacy : undefined,
        prescribedBy:
          selectedPrescriber !== 'All' ? selectedPrescriber : undefined,
        type: selectedType !== 'All' ? { type: selectedType } : undefined
      }
    : { memberId }

  const { data: prescriptionData, isLoading: isPrescriptionsLoading } =
    usePrescriptionList(header, prescriptionParams)

  const { data: pharmacyData, isLoading: isPharmacyLoading } = usePharmacyList(
    header,
    { memberId }
  )

  const { data: doctorsData, isLoading: isDoctorsLoading } = useActiveDoctors(
    header,
    { memberId }
  )

  const isLoading =
    isPrescriptionsLoading || isPharmacyLoading || isDoctorsLoading

  const prescriptionPrivileges = usePermissions(
    prescriptionData?.domainObjectPrivileges,
    'Medicine'
  )

  useEffect(() => {
    if (prescriptionData) {
      let list = prescriptionData.medicineList
        ? prescriptionData.medicineList
        : []
      setPrescriptionListFull(list)
      getFilteredList(list, currentFilter)
      setIsDataReceived(true)
      setIsFilter(false)
    }
  }, [prescriptionData])

  useEffect(() => {
    if (pharmacyData) {
      let list = pharmacyData.list ? pharmacyData.list : []
      let pharmacyDropdown: Array<{ id: number; title: string }> = [
        { id: 1, title: 'All' }
      ]
      list.map((data: PharmacyListItem, index: number) => {
        let object = {
          title: data.name,
          id: index + 2
        }
        pharmacyDropdown.push(object)
      })
      setPharmacyList(pharmacyDropdown)
      setPharmacyListFull(list)
    }
  }, [pharmacyData])

  useEffect(() => {
    if (doctorsData) {
      let list = doctorsData.doctorList ? doctorsData.doctorList : []
      let doctorDropdown: Array<{ id: number; title: string }> = [
        { id: 1, title: 'All' }
      ]
      list.map((data: ActiveDoctorItem, index: number) => {
        let object = {
          title: data.name,
          id: index + 2
        }
        doctorDropdown.push(object)
      })
      setDoctorList(doctorDropdown)
      setDoctorListFull(list)
    }
  }, [doctorsData])

  function setFilteredList(filter: string) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(prescriptionListFull, filter)
  }
  async function getFilteredList(list: PrescriptionListItem[], filter: string) {
    let filteredList: PrescriptionListItem[] = []
    list.map((data: PrescriptionListItem, index: number) => {
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
    let newDrugName = formData.drugName
    let newType = 'All'
    let newPharmacy = 'All'
    let newPrescriber: string | ActiveDoctorItem = 'All'

    if (formData.typeIndex !== 1) {
      newType = staticData.medicineTypeList[formData.typeIndex - 2].type
    }

    newPharmacy = pharmacyList[formData.pharmacyIndex - 1].title

    if (formData.prescribedIndex !== 1) {
      newPrescriber = doctorListFull[formData.prescribedIndex - 2]
    }

    setDrugName(newDrugName)
    setSelectedType(newType)
    setSelectedPharmacy(newPharmacy)
    setSelectedPrescriber(newPrescriber)
    setIsFilterApplied(true)
  }
  function resetFilter() {
    setDrugName('')
    setSelectedType('All')
    setSelectedPharmacy('All')
    setSelectedPrescriber('All')
    setIsFilterApplied(false)
    reset({
      typeIndex: 1,
      prescribedIndex: 1,
      pharmacyIndex: 1,
      drugName: ''
    })
  }

  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <PtsBackHeader title="Prescriptions" memberData={memberData} />
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
                  router.push(
                    formatUrl('/circles/addEditPrescription', {
                      memberData: JSON.stringify(memberData),
                      activeDoctorList: JSON.stringify(doctorListFull),
                      pharmacyList: JSON.stringify(pharmacyListFull)
                    })
                  )
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
      </View>
      {isFilter ? (
        <View className="mt-2 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="Type"
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
              label="Prescribed by"
              maxHeight={300}
              list={doctorList}
              className="w-[45%]"
              defaultValue="All"
            />
            <ControlledDropdown
              control={control}
              name="pharmacyIndex"
              label="Pharmacy"
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
        {prescriptionList.map((data: PrescriptionListItem, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push(
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
    </View>
  )
}
