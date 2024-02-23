import PtsTextInput from 'app/ui/PtsTextInput'
import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

export type CreateCircleProps = {
  onCancel: () => void
}
export function CreateCircle({ onCancel }: CreateCircleProps) {
  const [formStep, setFormStep] = useState(0)
  const [firstName, onChangeFirstName] = useState('Shubham')
  const [lastName, onChangeLastName] = useState('Chaudhari')
  const [email, onChangeEmail] = useState('sachaudhari0704@gmail.com')
  const [isManageCircle, setManageCircle] = useState(-1)

  return (
    <View className="absolute z-50 flex h-full w-full items-center justify-center p-8">
      <View className="z-50 h-[60%] items-center self-center rounded-2xl bg-white p-6 shadow-lg">
        <View className="flex items-center">
          <View className="flex-row items-center ">
            {formStep === 0 ? (
              <View className="border-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <View className="border-primary mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px]" />
              </View>
            ) : (
              <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <Feather name={'check'} size={20} color={'white'} />
              </View>
            )}
            <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
            {formStep <= 1 ? (
              <View
                className={`h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[${formStep !== 1 ? '#A8AAAD' : '#287CFA'}]`}
              >
                <View
                  className={`mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px] border-[${formStep !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                />
              </View>
            ) : (
              <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <Feather name={'check'} size={20} color={'white'} />
              </View>
            )}

            <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
            <View className="h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[#A8AAAD]">
              <View className="mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[3px] border-[#1A1A1A]" />
            </View>
          </View>
          <Typography className="font-400 mt-10 text-[16px] text-black">
            {formStep === 0
              ? 'Who is this Circle for?'
              : formStep === 1
                ? `Do you want to invite ${firstName} to manage their Circle?`
                : ''}
          </Typography>

          {formStep === 0 ? (
            <View className="my-5 flex flex-col gap-2">
              <Typography>{'First Name*'}</Typography>
              <PtsTextInput
                onChangeText={(firstName) => {
                  onChangeFirstName(firstName)
                }}
                placeholder={''}
                value={firstName}
                defaultValue=""
              />
              <Typography>{'Last Name*'}</Typography>
              <PtsTextInput
                onChangeText={(lastName) => {
                  onChangeLastName(lastName)
                }}
                placeholder={''}
                value={lastName}
                defaultValue=""
              />
              <View className="flex-row">
                <Feather name={'info'} size={25} className="color-primary" />
                <Typography className="ml-3">
                  {'Circles organize caregiving details for an individual.'}
                </Typography>
              </View>
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 ? (
            <View className="rounded-[25px] bg-[#EBECED] px-2 py-2 ">
              <View className="flex-row">
                <Pressable
                  onPress={() => {
                    setManageCircle(0)
                  }}
                  className={`bg-[${isManageCircle === 0 ? '#287CFA' : '#EBECED'}] rounded-[25px] px-10 py-2`}
                >
                  <Typography
                    className={`text- black items-center self-center font-bold`}
                  >
                    {'Yes'}
                  </Typography>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setManageCircle(1)
                  }}
                  className={`bg-[${isManageCircle === 1 ? '#287CFA' : '#EBECED'}] rounded-[25px] px-10 py-2`}
                >
                  <Typography
                    className={`items-center self-center font-bold text-black`}
                  >
                    {'No'}
                  </Typography>
                </Pressable>
              </View>
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 && isManageCircle === 0 ? (
            <View className="my-5">
              <Typography>{'Email Address*'}</Typography>
              <PtsTextInput
                className="w-full"
                onChangeText={(email) => {
                  onChangeEmail(email)
                }}
                placeholder={''}
                value={email}
                defaultValue=""
              />
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 && isManageCircle === 1 ? (
            <View className="my-5">
              <Typography>
                {`You will be the sole manager of ${firstName + "'s"} Circle.If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
              </Typography>
            </View>
          ) : (
            <View />
          )}
          {formStep === 2 ? (
            <View className="">
              <Typography className="font-400 text-[16px] text-black">
                {`What is ${firstName + "'s"} default timezone and timezone?`}
              </Typography>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View className="absolute bottom-[10] right-[10] flex-row">
          <Button
            className="mr-5"
            title="Cancel"
            variant="border"
            onPress={() => {
              setFormStep(0)
              onCancel()
            }}
          />
          <Button
            className=""
            title="Next"
            trailingIcon="arrow-right"
            onPress={() => {
              if (formStep < 2) {
                setFormStep((prev) => prev + 1)
              }
            }}
          />
        </View>
      </View>
    </View>
  )
}
