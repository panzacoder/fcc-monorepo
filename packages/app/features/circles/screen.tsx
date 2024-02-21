'use client'

import { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable
} from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { CircleCard } from 'app/ui/circle-card'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { COLORS } from 'app/utils/colors'
import { Stack } from 'expo-router'

export function CirclesListScreen() {
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isCreateCircle, setCreateCircle] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)
  const [firstName, onChangeFirstName] = useState('Shubham')
  const [lastName, onChangeLastName] = useState('Chaudhari')
  const [email, onChangeEmail] = useState('sachaudhari0704@gmail.com')
  let [circleScreenCount, setScreenCount] = useState(0)
  const [isManageCircle, setManageCircle] = useState(-1)

  const [isCreateCircleClicked, setCreateCircleClicked] = useState(false)
  const [memberList, setMemberList] = useState([])
  useEffect(() => {
    async function getMemberDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            setMemberList(data.data.memberList ? data.data.memberList : [])
            setDataReceived(true)
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getMemberDetails()
  }, [])
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Your Circles' }} />
      <PtsLoader loading={isLoading} />
      <View className="mr-[30] mt-[30] flex-row justify-end">
        <Pressable
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-100"
          onPress={() => {
            setCreateCircle(!isCreateCircle)
          }}
        >
          <Feather name={'plus'} size={25} className="color-primary" />
        </Pressable>
      </View>

      {isCreateCircle ? (
        <View className="mt-[-20] flex-row">
          <Typography className="w-[33%]" />
          <View className="mt-[5] w-[45%] rounded-[10px] bg-white py-5 shadow-lg">
            <TouchableOpacity
              className="flex-row"
              onPress={() => {
                setCreateCircleClicked(!isCreateCircleClicked)
                setCreateCircle(!isCreateCircle)
              }}
            >
              <View className="mx-3 h-[30px] w-[30px] flex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                <Feather name={'plus'} size={25} color={'black'} />
              </View>
              <Typography className="font-400 self-center text-[16px]">
                {'Create Circle'}
              </Typography>
            </TouchableOpacity>
            <View className="mt-3 flex-row">
              <TouchableOpacity className="flex-row">
                <View className="mx-3 h-[30px] w-[30px] flex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                  <Feather name={'check'} size={25} color={'black'} />
                </View>
                <Typography className="font-400 self-center text-[16px]">
                  {'Join Circle'}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-[20px] w-[20px] rounded-[10px] bg-white shadow-lg" />
          <View className="h-[10px] w-[10px] rounded-[5px] bg-white shadow-lg" />
        </View>
      ) : (
        <View />
      )}
      {isCreateCircleClicked ? (
        <View className="h-[60%] w-[90%] items-center self-center rounded-[15px] bg-white shadow-lg">
          <View className="absolute top-[10] ml-[20] flex-1 items-center ">
            <View className="flex-row items-center ">
              {circleScreenCount === 0 ? (
                <View className="border-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <View className="border-primary mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px]" />
                </View>
              ) : (
                <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <Feather name={'check'} size={20} color={'white'} />
                </View>
              )}
              <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
              {circleScreenCount <= 1 ? (
                <View
                  className={`h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                >
                  <View
                    className={`mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
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
              {circleScreenCount === 0
                ? 'Who is this Circle for?'
                : circleScreenCount === 1
                  ? `Do you want to invite ${firstName} to manage their Circle?`
                  : ''}
            </Typography>

            {circleScreenCount === 0 ? (
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
                  <Feather name={'info'} size={25} color={COLORS.primary} />
                  <Typography className="ml-3">
                    {'Circles organize caregiving details for an individual.'}
                  </Typography>
                </View>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 1 ? (
              <View className="rounded-[25px] bg-[#EBECED] px-2 py-2 ">
                <View className="flex-row">
                  <TouchableOpacity
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
                  </TouchableOpacity>
                  <TouchableOpacity
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
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 1 && isManageCircle === 0 ? (
              <View className="my-5">
                <Typography>{'Email Address*'}</Typography>
                <PtsTextInput
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
            {circleScreenCount === 1 && isManageCircle === 1 ? (
              <View className="my-5">
                <Typography>
                  {`You will be the sole manager of ${firstName + "'s"} Circle.If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
                </Typography>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 2 ? (
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
                setCreateCircleClicked(!isCreateCircleClicked)
                setScreenCount(0)
              }}
            />
            <Button
              className=""
              title="Next"
              trailingIcon="arrow-right"
              onPress={() => {
                if (circleScreenCount < 2) {
                  setScreenCount(++circleScreenCount)
                }
              }}
            />
          </View>
        </View>
      ) : (
        <View />
      )}

      <ScrollView>
        {memberList.map((data: any, index: number) => {
          return (
            <View key={index}>
              <CircleCard data={data}></CircleCard>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
