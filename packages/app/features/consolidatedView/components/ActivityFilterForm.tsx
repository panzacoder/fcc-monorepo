'use client'

import { View } from 'react-native'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { CalendarViewInput } from '../../addEditPrescription/calendar-view'

const schema = z.object({
  typeIndex: z.number()
})

interface ActivityFilterFormProps {
  typesList: { id: number; title: string }[]
  selectedDate: string
  onTypeChange: (value: { title: string; id: string }) => void
  onSelectDate: () => void
  onFilter: () => void
  onReset: () => void
}

export function ActivityFilterForm({
  typesList,
  selectedDate,
  onTypeChange,
  onSelectDate,
  onFilter,
  onReset
}: ActivityFilterFormProps) {
  const { control } = useForm({
    defaultValues: {
      typeIndex: 0
    },
    resolver: zodResolver(schema)
  })

  return (
    <View className="my-2">
      <View className="mt-2 w-full justify-center gap-4 rounded-[1px] px-4 shadow">
        <ControlledDropdown
          control={control}
          name="typeIndex"
          label="All"
          maxHeight={300}
          list={typesList}
          onChangeValue={onTypeChange}
        />
        <CalendarViewInput
          label="Select Date"
          value={selectedDate}
          onPress={onSelectDate}
        />
        <View className="my-3 mb-2 flex-row self-center">
          <View className="flex-row justify-center ">
            <Button title="Filter" leadingIcon="filter" onPress={onFilter} />
            <Button
              className="ml-5 bg-black"
              title={'Reset'}
              leadingIcon="rotate-ccw"
              variant="default"
              onPress={onReset}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
