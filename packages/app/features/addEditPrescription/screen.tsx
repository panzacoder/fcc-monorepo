import { useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { Button } from 'app/ui/button'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import { getFullDateForCalendar } from 'app/ui/utils'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import {
  useCreatePrescription,
  useUpdatePrescription
} from 'app/data/prescriptions'
import type { PrescriptionMedicineInput } from 'app/data/prescriptions/types'
import type { ActiveDoctorItem } from 'app/data/doctors/types'
import type { PharmacyListItem } from 'app/data/facilities/types'
import type { MedicineType } from 'app/data/types'
import type { StaticData } from 'app/data/static'
import {
  CalendarView,
  CalendarViewInput
} from '../addEditPrescription/calendar-view'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'
const schema = z.object({
  typeIndex: z.number().min(0, { message: 'Type is required' }),
  drugName: z.string().min(1, { message: 'Name is required' }),
  strength: z.string(),
  instructions: z.string(),
  notes: z.string()
})
export type Schema = z.infer<typeof schema>
type MemberRouteParams = {
  member?: number | string
  firstname?: string
  lastname?: string
}

export function AddEditPrescriptionScreen() {
  const item = useLocalSearchParams<Record<string, string>>()
  const router = useRouter()
  const header = useAppSelector((state) => state.headerState.header)
  const createPrescriptionMutation = useCreatePrescription(header)
  const updatePrescriptionMutation = useUpdatePrescription(header)
  const isLoading =
    createPrescriptionMutation.isPending || updatePrescriptionMutation.isPending
  let prescriptionDetails =
    item.prescriptionDetails !== undefined
      ? JSON.parse(item.prescriptionDetails)
      : {}
  let activeDoctorList =
    item.activeDoctorList !== undefined
      ? (JSON.parse(item.activeDoctorList) as ActiveDoctorItem[])
      : ([] as ActiveDoctorItem[])
  let pharmacyList =
    item.pharmacyList !== undefined
      ? (JSON.parse(item.pharmacyList) as PharmacyListItem[])
      : ([] as PharmacyListItem[])
  let memberData =
    item.memberData !== undefined
      ? (JSON.parse(item.memberData) as MemberRouteParams)
      : ({} as MemberRouteParams)
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [calenderClickedCount, setCalenderClickedCount] = useState(0)
  const [prescribedBy, setPrescribedBy] = useState(
    prescriptionDetails.doctorName ? prescriptionDetails.doctorName : ''
  )
  const [selectedPharmacy, setSelectedPharmacy] = useState(
    prescriptionDetails.pharmacy ? prescriptionDetails.pharmacy : ''
  )

  const [prescribedDate, setPrescribedDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.prescribedDate
      ? getFullDateForCalendar(
          prescriptionDetails.prescribedDate,
          'MMM DD, YYYY'
        )
      : 'Date Prescribed'
  )
  const [prescribedDateUtc, setPrescribedDateUtc] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.prescribedDate
      ? prescriptionDetails.prescribedDate
      : ''
  )
  const [startDate, setStartDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.startDate
      ? getFullDateForCalendar(prescriptionDetails.startDate, 'MMM DD, YYYY')
      : 'Start Date'
  )
  const [startDateUtc, setStartDateUtc] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.startDate
      ? prescriptionDetails.startDate
      : ''
  )
  const [endDate, setEndDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.endDate
      ? getFullDateForCalendar(prescriptionDetails.endDate, 'MMM DD, YYYY')
      : 'End Date'
  )
  const [endDateUtc, setEndDateUtc] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.endDate
      ? prescriptionDetails.endDate
      : ''
  )
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  // console.log('prescriptionDetails', JSON.stringify(prescriptionDetails))
  let typeIndex = -1
  let typesList: Array<{ id: number; title: string }> =
    staticData.medicineTypeList.map(
      ({ type, id }: MedicineType, index: number) => {
        if (!_.isEmpty(prescriptionDetails) && prescriptionDetails.type) {
          if (prescriptionDetails.type.type === type) {
            typeIndex = index + 1
          }
        }
        return {
          id: index + 1,
          title: type
        }
      }
    )
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(typeIndex)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      typeIndex: selectedTypeIndex,
      drugName:
        !_.isEmpty(prescriptionDetails) && prescriptionDetails.name
          ? prescriptionDetails.name
          : '',
      strength:
        !_.isEmpty(prescriptionDetails) && prescriptionDetails.strength
          ? prescriptionDetails.strength
          : '',
      instructions:
        !_.isEmpty(prescriptionDetails) && prescriptionDetails.instructions
          ? prescriptionDetails.instructions
          : '',
      notes:
        !_.isEmpty(prescriptionDetails) && prescriptionDetails.notes
          ? prescriptionDetails.notes
          : ''
    },
    resolver: zodResolver(schema)
  })
  const doctorList = activeDoctorList.map(
    (data: ActiveDoctorItem, index: number) => {
      return {
        label: data.name
      }
    }
  )
  const pharmaciesList = pharmacyList.map(
    (data: PharmacyListItem, index: number) => {
      return {
        label: data.name
      }
    }
  )
  async function createUpdatePrescription(object: {
    type: number | string
    drugName: string
    strength: string
    instructions: string
    notes: string
    prescribedBy: string
    selectedPharmacy: string
    prescribedDate: string | Date
    startDate: string | Date
    endDate: string | Date
  }) {
    let doctorId: number | string = ''
    let facilityId: number | string = ''
    if (object.prescribedBy !== '') {
      activeDoctorList.map((data: ActiveDoctorItem, index: number) => {
        if (data.name === object.prescribedBy) {
          doctorId = data.id
        }
      })
    }
    if (object.selectedPharmacy !== '') {
      pharmacyList.map((data: PharmacyListItem, index: number) => {
        if (data.name === object.selectedPharmacy) {
          facilityId = data.id
        }
      })
    }
    let medicine = {
      id: !_.isEmpty(prescriptionDetails) ? prescriptionDetails.id : null,
      name: object.drugName ? object.drugName : '',
      prescribedDate: object.prescribedDate ? object.prescribedDate : '',
      startDate: object.startDate ? object.startDate : '',
      endDate: object.endDate ? object.endDate : '',
      instructions: object.instructions ? object.instructions : '',
      notes: object.notes ? object.notes : '',
      strength: object.strength ? object.strength : '',
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
    const mutation = _.isEmpty(prescriptionDetails)
      ? createPrescriptionMutation
      : updatePrescriptionMutation
    mutation.mutate(
      { medicine },
      {
        onSuccess: (data) => {
          let details = data?.medicine ? data.medicine : {}
          if (_.isEmpty(prescriptionDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }
          router.push(
            formatUrl('/circles/prescriptionDetails', {
              prescriptionDetails: JSON.stringify(details),
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          logger.debug('error', error)
        }
      }
    )
  }
  async function callCreateUpdatePrescription(formData: Schema) {
    // console.log('in callCreateUpdatePrescription', formData.strength)
    let type = staticData.medicineTypeList[formData.typeIndex - 1].id
    let object = {
      type: type,
      drugName: formData.drugName,
      strength: formData.strength,
      instructions: formData.instructions,
      notes: formData.notes,
      prescribedBy: prescribedBy,
      selectedPharmacy: selectedPharmacy,
      prescribedDate:
        prescribedDate !== 'Date Prescribed' ? prescribedDateUtc : '',
      startDate: startDate !== 'Start Date' ? startDateUtc : '',
      endDate: endDate !== 'End Date' ? endDateUtc : ''
    }
    createUpdatePrescription(object)
  }
  const onSelectionPrescriber = (data: string) => {
    setPrescribedBy(data)
    // console.log('purpose1', purpose)
  }
  const onSelectionPharmacy = (data: string) => {
    setSelectedPharmacy(data)
    // console.log('purpose1', purpose)
  }

  const handleDateChange = (date: Date) => {
    logger.debug('handleDateChange', date)
    if (calenderClickedCount === 0) {
      setPrescribedDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
      setPrescribedDateUtc(date)
    } else if (calenderClickedCount === 1) {
      setStartDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
      setStartDateUtc(date)
    } else {
      setEndDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
      setEndDateUtc(date)
    }
    setIsShowCalender(false)
  }

  const handleDateCleared = () => {
    logger.debug('handleDateCleared')
    if (calenderClickedCount === 0) {
      setPrescribedDate('Date Prescribed')
      setPrescribedDateUtc('')
      setIsShowCalender(false)
    }
    if (calenderClickedCount === 1) {
      setStartDate('Start Date')
      setStartDateUtc('')
      setIsShowCalender(false)
    }
    if (calenderClickedCount === 2) {
      setEndDate('End Date')
      setEndDateUtc('')
      setIsShowCalender(false)
    }
  }

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(prescriptionDetails)
            ? 'Add Prescription'
            : 'Edit Prescription'
        }
        memberData={memberData}
      />
      <SafeAreaView>
        <ScrollView className="my-5 ">
          <View className="bg-card w-full justify-center gap-2 rounded-2xl border border-gray-400 p-5 px-4">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="Type*"
              maxHeight={300}
              list={typesList}
              className="w-full"
              defaultValue={
                !_.isEmpty(prescriptionDetails) &&
                prescriptionDetails.type &&
                prescriptionDetails.type.type
                  ? prescriptionDetails.type.type
                  : ''
              }
            />
            <ControlledTextField
              control={control}
              name="drugName"
              placeholder={'Drug Name*'}
              className="w-full"
            />
            <ControlledTextField
              control={control}
              name="strength"
              placeholder={'Strength'}
              className="w-full"
            />
            <PtsComboBox
              currentData={prescribedBy}
              listData={doctorList}
              onSelection={onSelectionPrescriber}
              placeholderValue={'Prescribed by'}
            />
            <PtsComboBox
              currentData={selectedPharmacy}
              listData={pharmaciesList}
              onSelection={onSelectionPharmacy}
              placeholderValue={'Pharmacy'}
            />

            <CalendarViewInput
              label="Date prescribed:"
              value={prescribedDate}
              onPress={() => {
                setCalenderClickedCount(0)
                setIsShowCalender(true)
              }}
            />

            <View className="flex flex-row gap-4">
              <CalendarViewInput
                className="flex-1"
                label="Start date:"
                value={startDate}
                onPress={() => {
                  setCalenderClickedCount(1)
                  setIsShowCalender(true)
                }}
              />

              <CalendarViewInput
                className="flex-1"
                label="End date:"
                value={endDate}
                onPress={() => {
                  setCalenderClickedCount(2)
                  setIsShowCalender(true)
                }}
              />
            </View>

            <ControlledTextField
              control={control}
              name="instructions"
              placeholder={'Instructions'}
            />
            <ControlledTextField
              control={control}
              name="notes"
              placeholder={'Notes'}
            />
            <View className="my-2 mb-5 flex-row justify-center">
              <Button
                className="bg-[#86939e]"
                title={'Cancel'}
                leadingIcon="x"
                variant="default"
                onPress={() => {
                  router.back()
                }}
              />
              <Button
                className="ml-5 bg-[#287CFA]"
                title={'Save'}
                leadingIcon="save"
                variant="default"
                onPress={handleSubmit(callCreateUpdatePrescription)}
              />
            </View>
            {isShowCalender && (
              <CalendarView
                component={'Prescription'}
                onCancel={() => setIsShowCalender(false)}
                onClear={handleDateCleared}
                calendarPickerProps={{ onDateChange: handleDateChange }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
