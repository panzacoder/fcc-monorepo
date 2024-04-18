'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { CallPostService } from 'app/utils/fetchServerData'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import {
  BASE_URL,
  GET_MEMBER_THREADS,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getUserPermission } from 'app/utils/getUserPemissions'
let messagePrivileges = {}

export function MessagesScreen() {
  const header = store.getState().headerState.header
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('All')
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [messagesList, setMessagesList] = useState([]) as any
  const [messagesListFull, setMessagesListFull] = useState([]) as any
  const item = useParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  const getMessageDetails = useCallback(
    async (isFromCreateThread: any, messageData: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_THREADS}`
      let dataObject = {
        header: header,
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // console.log('data', JSON.stringify(data.data.eventList))
            if (data.data.domainObjectPrivileges) {
              messagePrivileges = data.data.domainObjectPrivileges.MESSAGETHREAD
                ? data.data.domainObjectPrivileges.MESSAGETHREAD
                : {}
            }
            setMessagesList(data.data.threadList ? data.data.threadList : [])
            setMessagesListFull(
              data.data.threadList ? data.data.threadList : []
            )
            getFilteredList(
              data.data.threadList ? data.data.threadList : [],
              currentFilter
            )
            setIsDataReceived(true)
            if (isFromCreateThread) {
              router.push(
                formatUrl('/circles/noteMessage', {
                  component: 'General',
                  memberData: JSON.stringify(memberData),
                  noteData: JSON.stringify(messageData)
                })
              )
            }
            // console.log('threadList', threadList)
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    },
    []
  )
  useEffect(() => {
    getMessageDetails(false, {})
  }, [])
  function createMessageThread(subject: any, noteData: any) {
    setLoading(true)
    let url = `${BASE_URL}${CREATE_MESSAGE_THREAD}`
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
    let dataObject = {
      header: header,
      messageThread: {
        subject: subject,
        member: memberData.member ? memberData.member : '',
        type: {
          type: 'General'
        },
        participantList: list,
        messageList: []
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsMessageThread(false)
          let messageData = data.data.messageThread
            ? data.data.messageThread
            : {}
          getMessageDetails(true, messageData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function getThreadParticipants() {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD_PARTICIPANTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      messageThreadType: {
        type: 'General'
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          const list = data.data.map((data: any, index: any) => {
            let object = data
            object.isSelected = false
            return object
          })
          setParticipantsList(list)
          setIsMessageThread(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
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
      <View className="flex-row ">
        <Pressable
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
        </Pressable>
        {getUserPermission(messagePrivileges).createPermission ? (
          <View className="mt-[20] self-center">
            <Pressable
              className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                getThreadParticipants()
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </Pressable>
          </View>
        ) : (
          <View />
        )}
      </View>

      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <Pressable
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'General' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('General')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'General'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'Appointment' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Appointment')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Appointment'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'Incident' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Incident')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Incident'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'Purchase' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Purchase')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Purchase'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'Event' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Event')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Event'}
            </Typography>
          </Pressable>
        </View>
      ) : (
        <View />
      )}
      {messagesList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-[95%] self-center">
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
                      ? formatTimeToUserLocalTime(data.updatedOn)
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
