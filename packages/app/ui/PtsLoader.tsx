import { ActivityIndicator, Modal, View } from 'react-native'
export type Props = {
  loading?: boolean
}
const PtsLoader = ({ loading }: Props) => {
  return (
    <Modal
      animationType={'none'}
      transparent={true}
      visible={loading}
      supportedOrientations={['landscape', 'portrait']}
    >
      <View className="flex-1 items-center justify-around ">
        <View className="h-[50] w-[50] items-center justify-center rounded-[5px] bg-transparent">
          <ActivityIndicator size="large" color="#0d9195"></ActivityIndicator>
        </View>
      </View>
    </Modal>
  )
}
export default PtsLoader
