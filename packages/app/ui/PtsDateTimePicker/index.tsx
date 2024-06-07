import { useState } from 'react'
import {
  View,
  Platform,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import { Typography } from 'app/ui/typography'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { COLORS } from 'app/utils/colors'
import { Button } from 'react-native-elements'
let selectedTime: any = new Date()
let selectedDate: any = new Date()
export const PtsDateTimePicker = ({ currentData, onSelection }) => {
  // console.log('defaultValue', JSON.stringify(defaultValue))
  // console.log('currentData', JSON.stringify(currentData))
  // console.log('onSelection', JSON.stringify(onSelection))
  let date = new Date(currentData)
  // console.log('date', date)
  selectedTime = moment(date).format('hh:mm A')
  selectedDate = moment(date).format('DD MMM YYYY')
  const [isRender, setIsRender] = useState(false)
  const [isShowDateTimeModal, setDateTimeModal] = useState(false)
  const [isShowDateModal, setDateModal] = useState(false)
  const [isShowTimeModal, setTimeModal] = useState(false)
  const [dateSelected, setDateSelected] = useState(selectedDate)
  const [timeSelected, setTimeSelected] = useState(selectedTime)

  function getValueForPicker() {
    let date = new Date()
    date = new Date(moment(currentData).utc(true).local(true).unix() * 1000)
    return date
  }
  function cancelClicked() {
    setDateTimeModal(false)
    setTimeModal(false)
    setDateModal(false)
  }
  function getAndroidPickerView() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableHighlight
          onPress={() => {}}
          style={{ width: '100%' }}
          underlayColor={COLORS.transparent}
        >
          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.6,
              backgroundColor: COLORS.white
            }}
          >
            <DateTimePicker
              value={getValueForPicker()}
              testID="dateAndTimePicker"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              mode={
                isShowDateModal ? 'date' : isShowTimeModal ? 'time' : 'datetime'
              }
              style={{  }}
              onChange={(event, date) => {
                if (event.type === 'set') {
                  selectedTime = moment(date).format('hh:mm A')
                  selectedDate = moment(date).format('DD MMM YYYY')
                  currentData = date
                  setDateSelected(selectedDate)
                  setTimeSelected(selectedTime)
                  cancelClicked()
                  // console.log('date', date)
                  // console.log('selectedTime', selectedTime)
                  // console.log('selectedDate', selectedDate)
                  onSelection(date)
                } else {
                  cancelClicked()
                }
              }}
            />
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  function getIOSDatePickerView() {
    return (
      <Modal
        visible={isShowDateTimeModal}
        transparent={true}
        style={{ flex: 1 }}
        onRequestClose={() => {
          // cancelClicked()
        }}
      >
        <TouchableHighlight
          onPress={() => cancelClicked()}
          style={{ height: '100%', width: '100%' }}
          underlayColor={COLORS.transparent}
        >
          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.5,
              backgroundColor: COLORS.white
            }}
          >
            <DateTimePicker
              value={selectedDate}
              testID="dateAndTimePicker"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              mode={
                isShowDateModal ? 'date' : isShowTimeModal ? 'time' : 'datetime'
              }
              style={{}}
              onChange={(event, date) => {}}
            />
            {Platform.OS === 'ios' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  padding: 5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}
              >
                <Button
                  title={'Done'}
                  containerStyle={{ flex: 1, marginHorizontal: 10 }}
                  buttonStyle={{
                    padding: 3,
                    backgroundColor: COLORS.buttonOrange
                  }}
                  onPress={async () => {}}
                />
                <Button
                  title={'Cancel'}
                  containerStyle={{ flex: 1, marginHorizontal: 10 }}
                  buttonStyle={{ padding: 3, backgroundColor: COLORS.gray }}
                  onPress={() => cancelClicked()}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </TouchableHighlight>
      </Modal>
    )
  }
  return (
    <View className="mt-2 w-[95%] self-center bg-white">
      <View className="w-full flex-row self-center rounded-[5px] border-[1px] border-[#86939e] py-4">
        <TouchableOpacity
          onPress={() => {
            setDateTimeModal(true)
            setDateModal(true)
            setTimeModal(false)
            setIsRender(!isRender)
          }}
        >
          <Typography className="ml-2">{dateSelected}</Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDateTimeModal(true)
            setDateModal(false)
            setTimeModal(true)
            setIsRender(!isRender)
          }}
        >
          <Typography className="ml-2">{timeSelected}</Typography>
        </TouchableOpacity>
      </View>
      {isShowDateTimeModal ? (
        Platform.OS === 'ios' ? (
          getIOSDatePickerView()
        ) : (
          getAndroidPickerView()
        )
      ) : (
        <View />
      )}
    </View>
  )
}
