import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
export const CaregiverProfileInfo = ({ cancelClicked }) => {
  return (
    <View>
      <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#fbe2e3] py-5">
        <View className="my-5 w-full">
          <View className="w-full flex-row justify-center gap-2">
            <View className="mt-5 flex-row justify-center">
              <Button
                className="bg-[#86939e]"
                title="Cancel"
                variant="default"
                onPress={() => {
                  cancelClicked()
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
