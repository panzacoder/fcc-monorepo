import { useState } from 'react'
import { Pressable, View, TouchableHighlight, ScrollView } from 'react-native'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { COLORS } from 'app/utils/colors'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import { getFullDateForCalender } from 'app/ui/utils'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
import { Feather } from 'app/ui/icons'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import CalendarPicker from 'react-native-calendar-picker'
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

  function getCalenderView() {
    return (
      <View className="absolute top-[40] w-full self-center bg-white">
        <View className="bg-primary h-[50] w-full items-center justify-center rounded-tl-[20px] rounded-tr-[20px]">
          <TouchableHighlight
            style={{ paddingRight: 15, position: 'absolute', right: 0 }}
            onPress={() => setIsShowCalender(false)}
            underlayColor={COLORS.transparent}
          >
            <View className="h-[28] w-[28] items-center justify-center rounded-full bg-white">
              <Feather name={'x'} size={15} color={COLORS.primary} />
            </View>
          </TouchableHighlight>
        </View>
        <CalendarPicker
          textStyle={{}}
          onDateChange={(date) => {
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
          }}
        />
        <View className="mt-2 h-[1px] w-[97%] self-center bg-[#86939e]" />
        <Button
          title={'Clear'}
          className="mt-5 w-[40%] self-center bg-[#86939e]"
          onPress={() => {
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
          }}
        />
      </View>
    )
  }
  return (
    <ScrollView className=" my-2 max-h-[85%] w-full self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2 ">
      <View className="my-2 w-full">
        <View className="w-full  justify-center gap-2">
          <ControlledDropdown
            control={control}
            name="typeIndex"
            label="Type*"
            maxHeight={300}
            list={typesList}
            className="w-[95%] self-center"
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
            className="w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="strength"
            placeholder={'Strength'}
            className="w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <View className="">
            <PtsComboBox
              currentData={prescribedBy}
              listData={doctorList}
              onSelection={onSelectionPrescriber}
              placeholderValue={'Prescribed by'}
            />
          </View>
          <PtsComboBox
            currentData={selectedPharmacy}
            listData={pharmaciesList}
            onSelection={onSelectionPharmacy}
            placeholderValue={'Pharmacy'}
          />
          <Pressable
            onPress={() => {
              setCalenderClickedCount(0)
              setIsShowCalender(true)
            }}
            className="w-[95%] self-center rounded-lg border-[1px] border-gray-400 py-3"
          >
            <Typography
              className={`ml-4 ${prescribedDate === 'Date Prescribed' ? 'text-gray-400' : 'text-black'} `}
            >
              {prescribedDate}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setCalenderClickedCount(1)
              setIsShowCalender(true)
            }}
            className="w-[95%] self-center rounded-lg border-[1px] border-gray-400 py-3"
          >
            <Typography
              className={`ml-4 ${startDate === 'Start Date' ? 'text-gray-400' : 'text-black'} `}
            >
              {startDate}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setCalenderClickedCount(2)
              setIsShowCalender(true)
            }}
            className="w-[95%] self-center rounded-lg border-[1px] border-gray-400 py-3"
          >
            <Typography
              className={`ml-4 ${endDate === 'End Date' ? 'text-gray-400' : 'text-black'} `}
            >
              {endDate}
            </Typography>
          </Pressable>
          <ControlledTextField
            control={control}
            name="instructions"
            placeholder={'Instructions'}
            className="w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="notes"
            placeholder={'Notes'}
            className="w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
        </View>

        <View className="my-2 mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={'Save'}
            variant="default"
            onPress={handleSubmit(callCreateUpdatePrescription)}
          />
        </View>
        {isShowCalender ? getCalenderView() : <View />}
      </View>
    </ScrollView>
  )
}