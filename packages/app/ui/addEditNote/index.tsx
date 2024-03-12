import { View } from 'react-native'
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
export const AddEditNote = ({ noteData, cancelClicked, createUpdateNote }) => {
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
      title:
        !_.isEmpty(noteData) && noteData.shortDescription
          ? noteData.shortDescription
          : '',
      noteDetails: !_.isEmpty(noteData) && noteData.note ? noteData.note : '',
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
  async function callCreateUpdateNote(formData: Schema) {
    createUpdateNote(
      occuranceList[formData.occurrence].label,
      formData.noteDetails,
      formData.title,
      noteData
    )
  }
  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#FCF3CF] py-5">
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
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={_.isEmpty(noteData) ? 'Save' : 'Update'}
            variant="default"
            onPress={handleSubmit(callCreateUpdateNote)}
          />
        </View>
      </View>
    </View>
  )
}
