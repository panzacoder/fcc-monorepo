import { useState } from 'react'
import { TextInput, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'

type ComboBoxItem = {
  label: string
}

type PtsComboBoxProps = {
  currentData: string
  listData: ComboBoxItem[]
  onSelection: (value: string) => void
  placeholderValue: string
}

export const PtsComboBox = ({
  currentData,
  listData,
  onSelection,
  placeholderValue
}: PtsComboBoxProps) => {
  const [isShowDropdown, setIsShowDropdown] = useState(false)
  const [purpose, setPurpose] = useState(currentData)

  return (
    <View className="">
      <View className="focus:border-primary active:border-primary w-full flex-row rounded-lg border border-gray-400 py-2">
        <TextInput
          className={'flex-1 px-4'}
          keyboardType={'default'}
          defaultValue={purpose}
          placeholder={placeholderValue}
          onChangeText={(text) => {
            setPurpose(text)
            onSelection(text)
          }}
        />
        <Feather
          className="mx-5 self-center"
          onPress={() => {
            setIsShowDropdown(!isShowDropdown)
          }}
          name={!isShowDropdown ? 'chevron-down' : 'chevron-up'}
          size={15}
          color={'black'}
        />
      </View>
      {isShowDropdown ? (
        <View className="w-[95%] self-center ">
          <ScrollView className="">
            {listData.map((data: ComboBoxItem, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsShowDropdown(false)
                    setPurpose(data.label)
                    onSelection(data.label)
                  }}
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-[#9fc1c2]' : 'bg-white'}  border-[1px] border-gray-400 py-3`}
                >
                  <Typography className="ml-5">{data.label}</Typography>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
