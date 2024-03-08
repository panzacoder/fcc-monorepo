import { useState } from 'react'
import { TextInput, ScrollView, View, Pressable } from 'react-native'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store'
export const PtsComboBox = ({
  currentData,
  listData,
  onSelection,
  placeholderValue
}) => {
  const [isShowDropdown, setIsShowDropdown] = useState(false)
  const [purpose, setPurpose] = useState(currentData)

  return (
    <View>
      <View className="focus:border-primary active:border-primary w-[95%] flex-row self-center rounded-lg border-[1px] border-gray-400 py-3">
        <TextInput
          className={'w-[80%] flex-1 px-4'}
          keyboardType={'default'}
          defaultValue={purpose}
          placeholder={placeholderValue}
          onChangeText={(text) => {
            setPurpose(text)
            onSelection(text)
            // console.log('purpose', purpose)
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
        <View className="w-[95%] self-center">
          <ScrollView className="" keyboardShouldPersistTaps={'handled'}>
            {listData.map((data: any, index: number) => {
              return (
                <Pressable
                  onPress={() => {
                    setIsShowDropdown(false)
                    setPurpose(data.label)
                    onSelection(data.label)
                  }}
                  key={index}
                  className={`bg-[${index % 2 === 0 ? '#9fc1c2' : 'white'}]  border-[1px] border-gray-400 py-3`}
                >
                  <Typography className="ml-5">{data.label}</Typography>
                </Pressable>
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
