import { View } from 'react-native'
import { useAppSelector } from 'app/redux/hooks'
import { Button } from 'app/ui/button'
import { isEmpty } from 'app/ui/utils'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
import { logger } from 'app/utils/logger'
import type { TaskOccurance, PurchaseOccurance } from 'app/data/types.d'
import type { DropdownItem } from 'app/ui/PtsDropdown'

interface NoteData {
  id?: number | string
  shortDescription?: string
  note?: string
  occurance?: { occurance: string }
}

interface StaticData {
  taskOccuranceList: TaskOccurance[]
  purchaseOccuranceList: PurchaseOccurance[]
}

interface AddEditNoteProps {
  component: string
  noteData: NoteData
  cancelClicked: () => void
  createUpdateNote: (
    occurance: string,
    note: string,
    title: string,
    noteData: NoteData
  ) => void
}

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
}: AddEditNoteProps) => {
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  let occurance = ''
  let occuranceIndex = -1
  if (noteData.occurance && noteData.occurance.occurance) {
    occurance = noteData.occurance.occurance
    // facilityTypeIdex = getTypeIndex(facilityDetails.type)
    if (component === 'Appointment') {
      staticData.taskOccuranceList.map(
        async (data: TaskOccurance, index: number) => {
          if (data.occurance === noteData.occurance?.occurance) {
            occuranceIndex = index + 1
          }
        }
      )
    } else if (component === 'Medical Device') {
      staticData.purchaseOccuranceList.map(
        async (data: PurchaseOccurance, index: number) => {
          if (data.occurance === noteData.occurance?.occurance) {
            occuranceIndex = index + 1
          }
        }
      )
    }
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title:
        !isEmpty(noteData) && noteData.shortDescription
          ? noteData.shortDescription
          : '',
      note: !isEmpty(noteData) && noteData.note ? noteData.note : '',
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
      (data: TaskOccurance, index: number) => {
        return {
          title: data.occurance,
          id: index + 1
        }
      }
    )
  }
  if (component === 'Medical Device') {
    occuranceList = staticData.purchaseOccuranceList.map(
      (data: PurchaseOccurance, index: number) => {
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
        ? occuranceList[formData.occurrenceIndex - 1]?.title ?? ''
        : ''
    createUpdateNote(occurance, formData.note, formData.title, noteData)
  }
  async function setOccuranceChange(value: DropdownItem | null) {
    logger.debug('value', JSON.stringify(value))
    if (value === null) {
      reset({
        occurrenceIndex: -1
      })
    }
  }
  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-[#FCF3CF] py-5">
      <Typography className="self-center font-bold">{`${isEmpty(noteData) ? 'Add ' : 'Edit '} ${component} Note`}</Typography>
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
            title={isEmpty(noteData) ? 'Create' : 'Save'}
            variant="default"
            leadingIcon="save"
            onPress={handleSubmit(callCreateUpdateNote)}
          />
        </View>
      </View>
    </View>
  )
}
