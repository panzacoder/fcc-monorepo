import { useState } from 'react'
import { Pressable, View, TouchableHighlight, ScrollView } from 'react-native'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import { getFullDateForCalender } from 'app/ui/utils'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { CalendarView, CalendarViewInput } from './calendar-view'
let prescribedDateUtc: any = ''
let startDateUtc: any = ''
let endDateUtc: any = ''
const schema = z.object({
  typeIndex: z.number().min(0, { message: 'Type is required' }),
  drugName: z.string().min(1, { message: 'Name is required' }),
  strength: z.string(),
  instructions: z.string(),
  notes: z.string()
})
export type Schema = z.infer<typeof schema>
let prescribedBy: any = ''
let selectedPharmacy: any = ''
let selectedTypeIndex: any = -1
export const AddEditPrescription = ({
  prescriptionDetails,
  cancelClicked,
  createUpdatePrescription,
  activeDoctorList,
  pharmacyList
}) => {
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [calenderClickedCount, setCalenderClickedCount] = useState(0)
  const [prescribedDate, setPrescribedDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.prescribedDate
      ? getFullDateForCalender(
          prescriptionDetails.prescribedDate,
          'MMM DD, YYYY'
        )
      : 'Date Prescribed'
  )
  const [startDate, setStartDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.startDate
      ? getFullDateForCalender(prescriptionDetails.startDate, 'MMM DD, YYYY')
      : 'Start Date'
  )
  const [endDate, setEndDate] = useState(
    !_.isEmpty(prescriptionDetails) && prescriptionDetails.endDate
      ? getFullDateForCalender(prescriptionDetails.endDate, 'MMM DD, YYYY')
      : 'End Date'
  )
  const staticData: any = store.getState().staticDataState.staticData
  console.log('prescriptionDetails', JSON.stringify(prescriptionDetails))
  if (!_.isEmpty(prescriptionDetails)) {
    prescribedDateUtc = prescriptionDetails.prescribedDate
      ? prescriptionDetails.prescribedDate
      : ''
    startDateUtc = prescriptionDetails.startDate
      ? prescriptionDetails.startDate
      : ''
    endDateUtc = prescriptionDetails.endDate ? prescriptionDetails.endDate : ''
    prescribedBy = prescriptionDetails.doctorName
      ? prescriptionDetails.doctorName
      : ''
    selectedPharmacy = prescriptionDetails.pharmacy
      ? prescriptionDetails.pharmacy
      : ''
  }
  const typesList = staticData.medicineTypeList.map((data: any, index: any) => {
    if (!_.isEmpty(prescriptionDetails) && prescriptionDetails.type) {
      if (prescriptionDetails.type.type === data.type) {
        selectedTypeIndex = index + 1
      }
    }
    return {
      title: data.type,
      id: index + 1
    }
  })
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
  const doctorList = activeDoctorList.map((data: any, index: any) => {
    return {
      label: data.name
    }
  })
  const pharmaciesList = pharmacyList.map((data: any, index: any) => {
    return {
      label: data.name
    }
  })
  async function callCreateUpdatePrescription(formData: Schema) {
    // console.log('in callCreateUpdatePrescription')
    let type = typesList[formData.typeIndex - 1].id
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
  const onSelectionPrescriber = (data: any) => {
    prescribedBy = data
    // console.log('purpose1', purpose)
  }
  const onSelectionPharmacy = (data: any) => {
    selectedPharmacy = data
    // console.log('purpose1', purpose)
  }

  const handleDateChange = (date: Date) => {
    if (calenderClickedCount === 0) {
      setPrescribedDate(getFullDateForCalender(date, 'MMM DD, YYYY'))
      prescribedDateUtc = date
    } else if (calenderClickedCount === 1) {
      setStartDate(getFullDateForCalender(date, 'MMM DD, YYYY'))
      startDateUtc = date
    } else {
      setEndDate(getFullDateForCalender(date, 'MMM DD, YYYY'))
      endDateUtc = date
    }
    setIsShowCalender(false)
  }

  const handleDateCleared = () => {
    if (calenderClickedCount === 0) {
      setPrescribedDate('Date Prescribed')
      prescribedDateUtc = ''
      setIsShowCalender(false)
    }
    if (calenderClickedCount === 1) {
      setStartDate('Start Date')
      startDateUtc = ''
      setIsShowCalender(false)
    }
    if (calenderClickedCount === 2) {
      setEndDate('End Date')
      endDateUtc = ''
      setIsShowCalender(false)
    }
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      className="my-10 overflow-visible"
    >
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
          autoCapitalize="none"
        />
        <ControlledTextField
          control={control}
          name="strength"
          placeholder={'Strength'}
          className="w-full"
          autoCapitalize="none"
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

        <CalendarViewInput
          label="Start date:"
          value={startDate}
          onPress={() => {
            setCalenderClickedCount(1)
            setIsShowCalender(true)
          }}
        />

        <CalendarViewInput
          label="End date:"
          value={endDate}
          onPress={() => {
            setCalenderClickedCount(2)
            setIsShowCalender(true)
          }}
        />

        <ControlledTextField
          control={control}
          name="instructions"
          placeholder={'Instructions'}
          autoCapitalize="none"
        />
        <ControlledTextField
          control={control}
          name="notes"
          placeholder={'Notes'}
          autoCapitalize="none"
        />

        <View className="mt-2 flex flex-row justify-end gap-2">
          <Button
            className="basis-1/4"
            title="Cancel"
            variant="outline-destructive"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="flex-1"
            title={'Save'}
            onPress={handleSubmit(callCreateUpdatePrescription)}
          />
        </View>
        {isShowCalender && (
          <CalendarView
            onCancel={() => setIsShowCalender(false)}
            onClear={handleDateCleared}
            calendarPickerProps={{ onDateChange: handleDateChange }}
          />
        )}
      </View>
    </ScrollView>
  )
}
