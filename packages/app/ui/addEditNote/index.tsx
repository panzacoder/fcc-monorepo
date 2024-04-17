import { View } from 'react-native'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
const schema = z.object({
  title: z.string().min(1, { message: 'Note title is required' }),
  noteDetails: z.string().min(1, { message: 'Note details is required' }),
  occurrence: z.number().min(0, { message: 'Occurrence is required' })
})
export type Schema = z.infer<typeof schema>
let occurance: any = ''
export const AddEditNote = ({
  component,
  noteData,
  cancelClicked,
  createUpdateNote
}) => {
  const staticData: any = store.getState().staticDataState.staticData
  // console.log('notesData', noteData.occurance)
  let occuranceIndex = -1
  if (noteData.occurance && noteData.occurance.occurance) {
    occurance = noteData.occurance.occurance
    // facilityTypeIdex = getTypeIndex(facilityDetails.type)
    if (component === 'Appointment') {
      staticData.taskOccuranceList.map(async (data: any, index: any) => {
        if (data.occurance === noteData.occurance.occurance) {
          occuranceIndex = index
        }
      })
    } else if (component === 'Medical Device') {
      staticData.purchaseOccuranceList.map(async (data: any, index: any) => {
        if (data.occurance === noteData.occurance.occurance) {
          occuranceIndex = index
          console.log('occuranceIndex', '' + occuranceIndex)
        }
      })
    }
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title:
        !_.isEmpty(noteData) && noteData.shortDescription
          ? noteData.shortDescription
          : '',
      noteDetails: !_.isEmpty(noteData) && noteData.note ? noteData.note : '',
      occurrence:
        component === 'Appointment' || component === 'Medical Device'
          ? occuranceIndex
          : 0
    },
    resolver: zodResolver(schema)
  })
  let occuranceList = [] as any
  if (component === 'Appointment') {
    occuranceList = staticData.taskOccuranceList.map(
      (data: any, index: any) => {
        return {
          label: data.occurance,
          value: index
        }
      }
    )
  }
  if (component === 'Medical Device') {
    occuranceList = staticData.purchaseOccuranceList.map(
      (data: any, index: any) => {
        return {
          label: data.occurance,
          value: index
        }
      }
    )
  }

  async function callCreateUpdateNote(formData: Schema) {
    let occurance = occuranceList[formData.occurrence]?.label
      ? occuranceList[formData.occurrence]?.label
      : ''
    createUpdateNote(occurance, formData.noteDetails, formData.title, noteData)
  }
  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#FCF3CF] py-5">
      <Typography className="self-center font-bold">{`${component} Note`}</Typography>
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
        {component === 'Appointment' || component === 'Medical Device' ? (
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="occurrence"
              label="Occurrence*"
              className="w-[95%] bg-white"
              maxHeight={300}
              list={occuranceList}
              defaultValue={occurance}
              // onChangeValue={setSelectedCountryChange}
            />
          </View>
        ) : (
          <View />
        )}

        <View className="my-2 w-full flex-row justify-center">
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
