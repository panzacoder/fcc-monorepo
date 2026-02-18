'use client'

import { useState, useEffect, useCallback } from 'react'
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
import _ from 'lodash'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import {
  BASE_URL,
  GET_INCIDENT_DETAILS,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD,
  DELETE_INCIDENT_NOTE,
  CREATE_INCIDENT_NOTE,
  UPDATE_INCIDENT_NOTE,
  DELETE_INCIDENT
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/note'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'

let incidentPrivileges = {}
let notePrivileges = {}
export function IncidentDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [incidentDetails, setIncidentDetails] = useState({}) as any
  const [noteData, setNoteData] = useState({})
  const [notesList, setNotesList] = useState([])
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let incidentData =
    item.incidentDetails && item.incidentDetails !== undefined
      ? JSON.parse(item.incidentDetails)
      : {}
  // console.log('incidentDetails', JSON.stringify(incidentDetails))
  const getIncidentDetails = useCallback(
    async (isFromCreateThread: any, noteData: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_INCIDENT_DETAILS}`
      let dataObject = {
        header: header,
        incident: {
          id: incidentData.id ? incidentData.id : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // console.log('data', JSON.stringify(data.data))
            if (data.data.domainObjectPrivileges) {
              incidentPrivileges = data.data.domainObjectPrivileges.Incident
                ? data.data.domainObjectPrivileges.Incident
                : {}
              notePrivileges = data.data.domainObjectPrivileges.INCIDENTNOTE
                ? data.data.domainObjectPrivileges.INCIDENTNOTE
                : data.data.domainObjectPrivileges.IncidentNote
                  ? data.data.domainObjectPrivileges.IncidentNote
                  : {}
            }

            setIncidentDetails(data.data.incident ? data.data.incident : {})
            if (data.data.incident.noteList) {
              setNotesList(data.data.incident.noteList)
            }
            setIsRender(!isRender)
            if (isFromCreateThread) {
              router.push(
                formatUrl('/circles/noteMessage', {
                  component: 'Incident',
                  memberData: JSON.stringify(memberData),
                  noteData: JSON.stringify(noteData)
                })
              )
            }
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          logger.debug('error', error)
        })
    },
    []
  )
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
    if (!isAddNote) {
      getIncidentDetails(false, noteData)
    }
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
  if (!_.isEmpty(incidentDetails)) {
    if (incidentDetails.date) {
      incidentDate = formatTimeToUserLocalTime(incidentDetails.date)
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
    occurance: any,
    noteDetails: any,
    title: any,
    noteData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject = {
      header: header,
      note: {
        id: '',
        incident: {
          id: incidentDetails.id ? incidentDetails.id : ''
        },
        note: noteDetails,
        shortDescription: title
      }
    }
    if (_.isEmpty(noteData)) {
      url = `${BASE_URL}${CREATE_INCIDENT_NOTE}`
    } else {
      dataObject.note.id = noteData.id ? noteData.id : ''
      url = `${BASE_URL}${UPDATE_INCIDENT_NOTE}`
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsAddNote(false)
          getIncidentDetails(false, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  const cancelClicked = () => {
    setIsAddNote(false)
    setIsMessageThread(false)
  }
  const editNote = (noteData: any) => {
    // console.log('noteData', JSON.stringify(noteData))
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_INCIDENT_NOTE}`
    let dataObject = {
      header: header,
      note: {
        id: noteId
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getIncidentDetails(false, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  const messageThreadClicked = (noteData: any) => {
    logger.debug('messageThreadClicked', JSON.stringify(noteData))
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      // console.log('noteData', noteData)
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
  async function getThreadParticipants(noteData: any) {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD_PARTICIPANTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      messageThreadType: {
        type: 'Incident'
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('in getThreadParticipants')
          const list = data.data.map((data: any, index: any) => {
            let object = data
            object.isSelected = false
            return object
          })
          setParticipantsList(list)
          setNoteData(noteData)
          setIsMessageThread(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  function createMessageThread(subject: any, noteData: any) {
    setLoading(true)
    setNoteData(noteData)
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
        noteId: noteData.id ? noteData.id : '',
        type: {
          type: 'Incident'
        },
        participantList: list,
        incidentNote: {
          id: noteData.id ? noteData.id : ''
        },
        messageList: []
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsMessageThread(false)
          getIncidentDetails(true, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  function isParticipantSelected(index: any) {
    participantsList[index].isSelected = !participantsList[index].isSelected
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  async function deleteIncident() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_INCIDENT}`
    let dataObject = {
      header: header,
      incident: {
        id: incidentDetails.id ? incidentDetails.id : ''
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          router.dismiss(2)
          router.push(
            formatUrl('/circles/incidentsList', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
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
                {notesList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <Note
                        component={'Incident'}
                        data={data}
                        editNote={editNote}
                        deleteNote={deleteNote}
                        messageThreadClicked={messageThreadClicked}
                        notePrivileges={notePrivileges}
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
            createUpdateNote={createUpdateNote}
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
