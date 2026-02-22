'use client'

import { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { AddMessageThread } from 'app/ui/addMessageThread'
import memberNamesAction from 'app/redux/memberNames/memberNamesAction'
import {
  useMemberThreads,
  useThreadParticipants,
  useCreateMessageThread
} from 'app/data/messages'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getUserPermission } from 'app/utils/getUserPemissions'
export function MessagesScreen() {
  const dispatch = useAppDispatch()
  const header = useAppSelector((state) => state.headerState.header)
  const memberNamesList: any = useAppSelector(
    (state) => state.memberNames.memberNamesList
  )
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const router = useRouter()
  const messagePrivilegesRef = useRef<any>({})
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('All')
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [messagesList, setMessagesList] = useState([]) as any
  const [messagesListFull, setMessagesListFull] = useState([]) as any
  const [fetchParticipants, setFetchParticipants] = useState(false)
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}

  const threadParams = {
    member: {
      id: memberData.member ? memberData.member : ''
    }
  }

  const participantParams = {
    member: {
      id: memberData.member ? memberData.member : ''
    },
    messageThreadType: {
      type: 'General'
    }
  }

  const { data: threadsData, isLoading: isThreadsLoading } = useMemberThreads(
    header,
    threadParams
  )

  const { data: participantsData, isLoading: isParticipantsLoading } =
    useThreadParticipants(header, participantParams)

  const createThreadMutation = useCreateMessageThread(header)

  const isLoading =
    isThreadsLoading || isParticipantsLoading || createThreadMutation.isPending

  useEffect(() => {
    if (threadsData) {
      if (threadsData.domainObjectPrivileges) {
        messagePrivilegesRef.current = threadsData.domainObjectPrivileges
          .MESSAGETHREAD
          ? threadsData.domainObjectPrivileges.MESSAGETHREAD
          : threadsData.domainObjectPrivileges.MessageThread
            ? threadsData.domainObjectPrivileges.MessageThread
            : {}
      }
      let threadList = threadsData.threadList ? threadsData.threadList : []
      setMessagesList(threadList)
      setMessagesListFull(threadList)
      getFilteredList(
        threadsData.threadList ? threadsData.threadList : [],
        currentFilter
      )
      setIsDataReceived(true)
    }
  }, [threadsData])

  useEffect(() => {
    if (fetchParticipants && participantsData) {
      const list = participantsData.map((data: any, index: any) => {
        let object = data
        object.isSelected = false
        return object
      })
      setParticipantsList(list)
      setIsMessageThread(true)
      setFetchParticipants(false)
    }
  }, [fetchParticipants, participantsData])

  function createMessageThread(subject: any, noteData: any) {
    let list: object[] = []
    participantsList.map((data: any, index: any) => {
      if (data.isSelected === true) {
        let object = {
          user: {
            id: data.id
          }
        }
        list.push(object)
      }
    })
    createThreadMutation.mutate(
      {
        messageThread: {
          subject: subject,
          member: memberData.member ? memberData.member : '',
          type: {
            type: 'General'
          },
          participantList: list,
          messageList: []
        }
      },
      {
        onSuccess: (data: any) => {
          setIsMessageThread(false)
          let messageData = data?.messageThread ? data.messageThread : {}
          router.push(
            formatUrl('/circles/noteMessage', {
              component: 'General',
              memberData: JSON.stringify(memberData),
              noteData: JSON.stringify(messageData)
            })
          )
        }
      }
    )
  }
  function getThreadParticipants() {
    setFetchParticipants(true)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    list.map((data: any, index: any) => {
      let type = data.type && data.type.type ? data.type.type : ''
      if (filter === 'All') {
        filteredList = list
      } else if (filter === type) {
        filteredList.push(data)
      }
    })
    setMessagesList(filteredList)
  }
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(messagesListFull, filter)
  }
  const cancelClicked = () => {
    setIsMessageThread(false)
  }
  function isParticipantSelected(index: any) {
    participantsList[index].isSelected = !participantsList[index].isSelected
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Messages" memberData={memberData} />
      <View className="flex-row ">
        <TouchableOpacity
          onPress={() => {
            setIsShowFilter(!isShowFilter)
          }}
          className="w-[85%] flex-row"
        >
          <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
            {currentFilter}
          </Typography>
          <Feather
            className="ml-2 mt-6"
            name={!isShowFilter ? 'chevron-down' : 'chevron-up'}
            size={25}
            color={'black'}
          />
        </TouchableOpacity>
        {getUserPermission(messagePrivilegesRef.current).createPermission ? (
          <View className="mt-[20] self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                getThreadParticipants()
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>

      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <TouchableOpacity
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'General' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('General')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'General'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Appointment' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Appointment')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Appointment'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Incident' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Incident')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Incident'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Purchase' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Purchase')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Purchase'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Event' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Event')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Event'}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      {messagesList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-full self-center">
          {messagesList.map((data: any, index: number) => {
            return (
              <Pressable
                onPress={() => {
                  router.push(
                    formatUrl('/circles/noteMessage', {
                      component: 'General',
                      memberData: JSON.stringify(memberData),
                      noteData: JSON.stringify(data)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className="w-[90%] flex-row">
                  <View>
                    <View className="my-2 flex-row">
                      <Typography className="text-primary font-400 ml-5 mr-5 w-[60%] max-w-[60%] text-[16px]">
                        {data.subject ? data.subject : ''}
                      </Typography>
                      <View className="">
                        <Typography className="text-black">
                          {data.type && data.type.type ? data.type.type : ''}
                        </Typography>
                      </View>
                    </View>
                    <View className="flex-row">
                      <Typography className="font-400 ml-5 w-full text-black">
                        {data.updatedOn
                          ? formatTimeToUserLocalTime(
                              data.updatedOn,
                              userAddress,
                              memberAddress
                            )
                          : ''}
                      </Typography>
                    </View>
                    <View className="w-[30%]">
                      {data.unreadMessageCount > 0 ? (
                        <View className="flex-row">
                          <Feather
                            className="ml-5 mt-1"
                            name={'message-circle'}
                            size={25}
                            color={'green'}
                          />

                          <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                            {data.unreadMessageCount}
                          </Typography>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                    <ScrollView
                      horizontal={true}
                      className="w-[95%] max-w-[95%] flex-row"
                    >
                      {data.participantDetailsList.map(
                        (data: any, index: number) => {
                          let fullName = data.name ? data.name : ''
                          if (memberNamesList.includes(fullName) === false) {
                            memberNamesList.push(fullName)
                            dispatch(
                              memberNamesAction.setMemberNames(memberNamesList)
                            )
                          }
                          return (
                            <View key={index} className="ml-2">
                              <PtsNameInitials
                                fullName={data.name ? data.name : ''}
                              />
                            </View>
                          )
                        }
                      )}
                    </ScrollView>
                  </View>
                  <View className=" ml-[-10] self-center">
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </View>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
      {isDataReceived && messagesList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} messages`}</Typography>
        </View>
      ) : (
        <View />
      )}
      {isMessageThread ? (
        <View className="h-full w-full  ">
          <AddMessageThread
            participantsList={participantsList}
            noteData={{}}
            cancelClicked={cancelClicked}
            isParticipantSelected={isParticipantSelected}
            createMessageThread={createMessageThread}
            isUpdateParticipants={false}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
