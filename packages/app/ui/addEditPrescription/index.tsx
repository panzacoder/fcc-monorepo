import { useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import { getFullDateForCalendar } from 'app/ui/utils'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { CalendarView, CalendarViewInput } from './calendar-view'
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
  const staticData: any = store.getState().staticDataState.staticData
  // console.log('prescriptionDetails', JSON.stringify(prescriptionDetails))
  if (!_.isEmpty(prescriptionDetails)) {
    prescribedBy = prescriptionDetails.doctorName
      ? prescriptionDetails.doctorName
      : ''
    selectedPharmacy = prescriptionDetails.pharmacy
      ? prescriptionDetails.pharmacy
      : ''
  }
  type TypeResponse = {
    id: number
    type: string
  }
  // const typesList = staticData.medicineTypeList.map((data: any, index: any) => {
  //   if (!_.isEmpty(prescriptionDetails) && prescriptionDetails.type) {
  //     if (prescriptionDetails.type.type === data.type) {
  //       selectedTypeIndex = index + 1
  //     }
  //   }
  //   return {
  //     title: data.type,
  //     id: index + 1
  //   }
  // })
  //dropdown is not working for 0 as id, so we started id from 1
  let typesList: Array<{ id: number; title: string }> =
    staticData.medicineTypeList.map(
      ({ type, id }: TypeResponse, index: any) => {
        return {
          id: index + 1,
          title: type
        }
      }
    )
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
  const onSelectionPrescriber = (data: any) => {
    prescribedBy = data
    // console.log('purpose1', purpose)
  }
  const onSelectionPharmacy = (data: any) => {
    selectedPharmacy = data
    // console.log('purpose1', purpose)
  }

  const handleDateChange = (date: Date) => {
    console.log('handleDateChange', date)
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
    console.log('handleDateCleared')
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
    <ScrollView automaticallyAdjustKeyboardInsets className="my-5 ">
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
          autoCapitalize="none"
        />
        <ControlledTextField
          control={control}
          name="notes"
          placeholder={'Notes'}
          autoCapitalize="none"
        />

        <View className="mb-10 mt-2 flex flex-row justify-end gap-2">
          <Button
            className=""
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
            component={'Prescription'}
            onCancel={() => setIsShowCalender(false)}
            onClear={handleDateCleared}
            calendarPickerProps={{ onDateChange: handleDateChange }}
          />
        )}
      </View>
    </ScrollView>
  )
}
