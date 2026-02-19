import { View } from 'react-native'
import { useAppSelector } from 'app/redux/hooks'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
import { logger } from 'app/utils/logger'
const schema = z.object({
  title: z.string().min(1, { message: 'Note title is required' }),
  note: z.string().min(1, { message: 'Note details is required' }),
  occurrenceIndex: z.number().min(0, { message: 'Occurrence is required' })
})
export type Schema = z.infer<typeof schema>
export const AddEditNote = ({
  component,
  noteData,
  cancelClicked,
  createUpdateNote
}) => {
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  let occurance: any = ''
  // console.log('notesData', noteData.occurance)
  let occuranceIndex = -1
  if (noteData.occurance && noteData.occurance.occurance) {
    occurance = noteData.occurance.occurance
    // facilityTypeIdex = getTypeIndex(facilityDetails.type)
    if (component === 'Appointment') {
      staticData.taskOccuranceList.map(async (data: any, index: any) => {
        if (data.occurance === noteData.occurance.occurance) {
          occuranceIndex = index + 1
        }
      })
    } else if (component === 'Medical Device') {
      staticData.purchaseOccuranceList.map(async (data: any, index: any) => {
        if (data.occurance === noteData.occurance.occurance) {
          occuranceIndex = index + 1
          // console.log('occuranceIndex', '' + occuranceIndex)
        }
      })
    }
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title:
        !_.isEmpty(noteData) && noteData.shortDescription
          ? noteData.shortDescription
          : '',
      note: !_.isEmpty(noteData) && noteData.note ? noteData.note : '',
      occurrenceIndex:
        component === 'Appointment' || component === 'Medical Device'
          ? occuranceIndex
          : 1
    },
    resolver: zodResolver(schema)
  })
  let occuranceList: Array<{ id: number; title: string }> = []
  if (component === 'Appointment') {
    occuranceList = staticData.taskOccuranceList.map(
      (data: any, index: any) => {
        return {
          title: data.occurance,
          id: index + 1
        }
      }
    )
  }
  if (component === 'Medical Device') {
    occuranceList = staticData.purchaseOccuranceList.map(
      (data: any, index: any) => {
        return {
          title: data.occurance,
          id: index + 1
        }
      }
    )
  }

  async function callCreateUpdateNote(formData: Schema) {
    let occurance =
      formData.occurrenceIndex !== -1
        ? occuranceList[formData.occurrenceIndex - 1]?.title
        : ''
    createUpdateNote(occurance, formData.note, formData.title, noteData)
  }
  async function setOccuranceChange(value: any) {
    logger.debug('value', JSON.stringify(value))
    if (value === null) {
      reset({
        occurrenceIndex: -1
      })
    }
  }
  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-[#FCF3CF] py-5">
      <Typography className="self-center font-bold">{`${_.isEmpty(noteData) ? 'Add ' : 'Edit '} ${component} Note`}</Typography>
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
              name="occurrenceIndex"
              label="Occurrence*"
              className="w-[95%] bg-white"
              maxHeight={300}
              list={occuranceList}
              defaultValue={occurance}
              // onChangeValue={setOccuranceChange}
            />
          </View>
        ) : (
          <View />
        )}
        <View className="w-full flex-row justify-center gap-2">
          <ControlledTextField
            control={control}
            name="note"
            placeholder={'Enter note details*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            leadingIcon="x"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={_.isEmpty(noteData) ? 'Create' : 'Save'}
            variant="default"
            leadingIcon="save"
            onPress={handleSubmit(callCreateUpdateNote)}
          />
        </View>
      </View>
    </View>
  )
}
