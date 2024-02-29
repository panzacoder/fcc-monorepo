import { useState } from 'react'
import { View, Alert } from 'react-native'
import { useRouter } from 'solito/navigation'
import { CallPostService } from 'app/utils/fetchServerData'
import PtsLoader from 'app/ui/PtsLoader'
import {
  BASE_URL,
  CREATE_APPOINTMENT_NOTE,
  UPDATE_APPOINTMENT_NOTE
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({
  title: z.string().min(1, { message: 'Note title is required' }),
  noteDetails: z.string().min(1, { message: 'Note details is required' }),
  occurrence: z.number().min(0, { message: 'Occurrence is required' })
})
export type Schema = z.infer<typeof schema>
export const AddEditNote = ({ noteData, appointmentId, refreshData }) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const header = store.getState().headerState.header
  const staticData = store.getState().staticDataState.staticData
  // console.log('notesData', noteData.occurance)
  let occuranceIndex = -1
  if (noteData.occurance && noteData.occurance.occurance) {
    // facilityTypeIdex = getTypeIndex(facilityDetails.type)
    staticData.taskOccuranceList.map(async (data: any, index: any) => {
      if (data.occurance === noteData.occurance.occurance) {
        occuranceIndex = index
      }
    })
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: !_.isEmpty(noteData) && noteData.shortDescription ? noteData.shortDescription : '',
      noteDetails:
        !_.isEmpty(noteData) && noteData.note
          ? noteData.note
          : '',
      occurrence: occuranceIndex
    },
    resolver: zodResolver(schema)
  })
  const occuranceList = staticData.taskOccuranceList.map(
    (data: any, index: any) => {
      return {
        label: data.occurance,
        value: index
      }
    }
  )
  async function createUpdateNote(formData: Schema) {
    setLoading(true)
    let url = ''
    let dataObject = {
      header: header,
      appointmentNote: {
        id: '',
        appointment: {
          id: appointmentId
        },
        occurance: {
          occurance: occuranceList[formData.occurrence].label
        },
        note: formData.noteDetails,
        shortDescription: formData.title
      }
    }
    if (_.isEmpty(noteData)) {
      url = `${BASE_URL}${CREATE_APPOINTMENT_NOTE}`
    } else {
      dataObject.appointmentNote.id = noteData.id ? noteData.id : ''
      url = `${BASE_URL}${UPDATE_APPOINTMENT_NOTE}`
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          // router.push(
          //   formatUrl('/(authenticated)/circles/doctors', {
          //     memberData: JSON.stringify(memberData)
          //   })
          // )
          // router.back()
          refreshData()
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
    <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#FCF3CF] py-5">
      <PtsLoader loading={isLoading} />
      <View className="my-5 w-full">
        <View className="w-full flex-row justify-center gap-2">
          <ControlledTextField
            control={control}
            name="title"
            placeholder={'Title*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="my-2 w-full flex-row justify-center">
          <ControlledDropdown
            control={control}
            name="occurrence"
            label="Occurrence*"
            className="w-[95%] bg-white"
            maxHeight={300}
            list={occuranceList}
            // onChangeValue={setSelectedCountryChange}
          />
        </View>
        <View className="w-full flex-row justify-center gap-2">
          <ControlledTextField
            control={control}
            name="noteDetails"
            placeholder={'Enter note details*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            variant="default"
            onPress={() => {
              refreshData(true)
            }}
          />
          <Button
            className="ml-5"
            title={_.isEmpty(noteData) ? 'Save' : 'Update'}
            variant="default"
            onPress={handleSubmit(createUpdateNote)}
          />
        </View>
      </View>
    </View>
  )
}
