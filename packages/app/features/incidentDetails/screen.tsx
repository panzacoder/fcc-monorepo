'use client'

import { useState, useEffect, useCallback, type ComponentProps } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native'
// import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import {
  useIncidentDetails,
  useDeleteIncident,
  useCreateIncidentNote,
  useUpdateIncidentNote,
  useDeleteIncidentNote
} from 'app/data/incidents'
import type {
  IncidentDetailResponse,
  IncidentDetail,
  IncidentNote,
  IncidentNoteData
} from 'app/data/incidents/types'
import {
  useThreadParticipants,
  useCreateMessageThread
} from 'app/data/messages'
import type { ThreadParticipant } from 'app/data/messages/types'
import { usePermissions } from 'app/utils/usePermissions'
import { useLocalSearchParams } from 'expo-router'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/note'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatTimeToUserLocalTime, isEmpty } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useAppSelector } from 'app/redux/hooks'

type MemberRouteParams = {
  member: number | string
  firstname?: string
  lastname?: string
}

export function IncidentDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState<ThreadParticipant[]>(
    []
  )
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [incidentDetails, setIncidentDetails] = useState<
    Partial<IncidentDetail>
  >({})
  const [noteData, setNoteData] = useState<Partial<IncidentNote>>({})
  const [notesList, setNotesList] = useState<IncidentNote[]>([])
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<Record<string, string>>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? (JSON.parse(item.memberData) as MemberRouteParams)
      : ({} as MemberRouteParams)
  let incidentData =
    item.incidentDetails && item.incidentDetails !== undefined
      ? JSON.parse(item.incidentDetails)
      : {}

  const incidentId = incidentData.id ? Number(incidentData.id) : 0
  const {
    data: incidentDetailsData,
    isLoading: isDetailsLoading,
    refetch: refetchDetails
  } = useIncidentDetails(header, incidentId)

  const deleteIncidentMutation = useDeleteIncident(header)
  const createNoteMutation = useCreateIncidentNote(header)
  const updateNoteMutation = useUpdateIncidentNote(header)
  const deleteNoteMutation = useDeleteIncidentNote(header)
  const createMessageThreadMutation = useCreateMessageThread(header)

  const threadParticipantsParams = {
    member: {
      id: memberData.member ? memberData.member : ''
    },
    messageThreadType: {
      type: 'Incident'
    }
  }
  const {
    data: threadParticipantsData,
    isLoading: isParticipantsLoading,
    refetch: refetchParticipants
  } = useThreadParticipants(header, threadParticipantsParams)

  const incidentData_ = incidentDetailsData as
    | IncidentDetailResponse
    | undefined
  const incidentPrivileges = usePermissions(
    incidentData_?.domainObjectPrivileges,
    'Incident'
  )
  const notePrivileges = usePermissions(
    incidentData_?.domainObjectPrivileges,
    'INCIDENTNOTE',
    'IncidentNote'
  )

  useEffect(() => {
    if (incidentDetailsData) {
      const data = incidentDetailsData as IncidentDetailResponse
      setIncidentDetails(data.incident ? data.incident : {})
      if (data.incident && data.incident.noteList) {
        setNotesList(data.incident.noteList)
      }
    }
  }, [incidentDetailsData])

  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/incidentsList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  let incidentDate = '',
    incident = '',
    type = '',
    description = ''
  let incidentAddress = {}
  if (!isEmpty(incidentDetails)) {
    if (incidentDetails.date) {
      incidentDate = formatTimeToUserLocalTime(
        incidentDetails.date,
        userAddress,
        memberAddress
      )
    }
    if (incidentDetails.title) {
      incident = incidentDetails.title
    }
    if (incidentDetails.type) {
      type = incidentDetails.type
    }
    if (incidentDetails.description) {
      description = incidentDetails.description
    }
    if (incidentDetails.location) {
      incidentAddress = incidentDetails.location
    }
  }
  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
      </View>
    )
  }

  async function createUpdateNote(
    occurance: string,
    noteDetails: string,
    title: string,
    noteData: Partial<IncidentNote>
  ) {
    const notePayload: IncidentNoteData = {
      incident: {
        id: incidentDetails.id ? incidentDetails.id : ''
      },
      note: noteDetails,
      shortDescription: title
    }

    if (isEmpty(noteData)) {
      createNoteMutation.mutate(
        { note: notePayload },
        {
          onSuccess: () => {
            setIsAddNote(false)
            refetchDetails()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create note')
          }
        }
      )
    } else {
      notePayload.id = noteData.id ? noteData.id : ''
      updateNoteMutation.mutate(
        { note: notePayload },
        {
          onSuccess: () => {
            setIsAddNote(false)
            refetchDetails()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update note')
          }
        }
      )
    }
  }
  const cancelClicked = () => {
    setIsAddNote(false)
    setIsMessageThread(false)
  }
  const editNote = (noteData: IncidentNote) => {
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: number) {
    deleteNoteMutation.mutate(
      { note: { id: noteId } },
      {
        onSuccess: () => {
          refetchDetails()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete note')
        }
      }
    )
  }
  const messageThreadClicked = (noteData: IncidentNote) => {
    logger.debug('messageThreadClicked', JSON.stringify(noteData))
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Incident',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(noteData)
        })
      )
    } else {
      getThreadParticipants(noteData)
    }
  }
  async function getThreadParticipants(noteData: IncidentNote) {
    setLoading(true)
    try {
      const result = await refetchParticipants()
      setLoading(false)
      if (result.data) {
        const list = (result.data as ThreadParticipant[]).map(
          (item: ThreadParticipant) => {
            let object = item
            object.isSelected = false
            return object
          }
        )
        setParticipantsList(list)
        setNoteData(noteData)
        setIsMessageThread(true)
      }
    } catch (error: unknown) {
      setLoading(false)
      logger.debug(error)
    }
  }
  function createMessageThread(
    subject: string,
    noteData: Partial<IncidentNote>
  ) {
    setNoteData(noteData)
    let list: { user: { id: number } }[] = []
    participantsList.map((data: ThreadParticipant, index: number) => {
      if (data.isSelected === true) {
        let object = {
          user: {
            id: data.id
          }
        }
        list.push(object)
      }
    })
    createMessageThreadMutation.mutate(
      {
        messageThread: {
          subject: subject,
          member: memberData.member ? memberData.member : '',
          noteId: noteData.id ? noteData.id : '',
          type: {
            type: 'Incident'
          },
          participantList: list,
          messageList: []
        }
      },
      {
        onSuccess: () => {
          setIsMessageThread(false)
          refetchDetails()
          router.push(
            formatUrl('/circles/noteMessage', {
              component: 'Incident',
              memberData: JSON.stringify(memberData),
              noteData: JSON.stringify(noteData)
            })
          )
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }
  function isParticipantSelected(index: number) {
    const participant = participantsList[index]
    if (!participant) return
    participant.isSelected = !participant.isSelected
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  async function deleteIncident() {
    deleteIncidentMutation.mutate(
      { incident: { id: incidentDetails.id ? incidentDetails.id : 0 } },
      {
        onSuccess: () => {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/incidentsList', {
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete incident')
        }
      }
    )
  }

  const isMutating =
    deleteIncidentMutation.isPending ||
    createNoteMutation.isPending ||
    updateNoteMutation.isPending ||
    deleteNoteMutation.isPending ||
    createMessageThreadMutation.isPending

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading || isDetailsLoading || isMutating} />
      <PtsBackHeader title="Incident Details" memberData={memberData} />
      <View className=" h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View style={{ justifyContent: 'flex-end' }} className="flex-row">
              {getUserPermission(incidentPrivileges).createPermission ? (
                <Button
                  className="w-[50%]"
                  title="Create Similar"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditIncident', {
                        memberData: JSON.stringify(memberData),
                        incidentDetails: JSON.stringify(incidentDetails),
                        isFromCreateSimilar: 'true'
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
              {getUserPermission(incidentPrivileges).updatePermission ? (
                <Button
                  className="ml-[5px] w-[30%]"
                  title="Edit"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditIncident', {
                        memberData: JSON.stringify(memberData),
                        incidentDetails: JSON.stringify(incidentDetails)
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
            </View>
            <View className="w-full">
              <View className="mt-2 flex-row">
                <Typography className=" font-400 w-[95%] text-[15px] text-black">
                  {incident}
                </Typography>
              </View>
              {getDetailsView('Date', incidentDate)}
              {getDetailsView('Type', type)}
              {getDetailsView('Description', description)}
            </View>
          </View>
          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <Typography className="font-[15px] font-bold text-[#287CFA]">
              {'Location Details'}
            </Typography>
            <View className="w-full">
              <Location data={incidentAddress}></Location>
            </View>
          </View>

          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowNotes(!isShowNotes)
                }}
                className="w-[60%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Notes'}
                  {notesList.length > 0 ? ' (' + notesList.length + ') ' : ''}
                </Typography>
                {notesList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowNotes ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
              {getUserPermission(notePrivileges).createPermission ? (
                <Button
                  className=""
                  title="Add Note"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setNoteData({})
                    setIsAddNote(true)
                  }}
                />
              ) : (
                <View />
              )}
            </View>

            {notesList.length > 0 && isShowNotes ? (
              <ScrollView className="">
                {notesList.map((data: IncidentNote, index: number) => {
                  return (
                    <View key={index}>
                      <Note
                        component={'Incident'}
                        data={data}
                        editNote={
                          editNote as ComponentProps<typeof Note>['editNote']
                        }
                        deleteNote={
                          deleteNote as ComponentProps<
                            typeof Note
                          >['deleteNote']
                        }
                        messageThreadClicked={
                          messageThreadClicked as ComponentProps<
                            typeof Note
                          >['messageThreadClicked']
                        }
                        notePrivileges={
                          notePrivileges as unknown as ComponentProps<
                            typeof Note
                          >['notePrivileges']
                        }
                      />
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>

          {getUserPermission(incidentPrivileges).deletePermission ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Incident?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteIncident()
                      },
                      { text: 'Cancel', onPress: () => {} }
                    ]
                  )
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
      {isAddNote ? (
        <View className="h-full w-full">
          <AddEditNote
            component={'Incident'}
            noteData={noteData}
            cancelClicked={cancelClicked}
            createUpdateNote={
              createUpdateNote as ComponentProps<
                typeof AddEditNote
              >['createUpdateNote']
            }
          />
        </View>
      ) : (
        <View />
      )}

      {isMessageThread ? (
        <View className="h-full w-full">
          <AddMessageThread
            participantsList={participantsList}
            noteData={noteData}
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
