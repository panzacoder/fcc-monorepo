import { isEmpty } from 'app/ui/utils'
import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Note } from 'app/ui/note'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useModal } from 'app/utils/useModal'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import type { ComponentProps } from 'react'
import type { PrivilegeAction } from 'app/data/types.d'
import type { ThreadParticipant } from 'app/data/messages/types'
import type { AppointmentDetailsHookReturn } from '../hooks/useAppointmentDetailsData'

interface NoteItem {
  id: number | string
  shortDescription?: string
  note?: string
  occurance?: { occurance: string }
  hasMsgThread?: boolean
}

interface AppointmentNotesSectionProps {
  appointmentId: number | string
  notesList: NoteItem[]
  notePrivileges: PrivilegeAction[]
  memberData: Record<string, unknown>
  createNoteMutation: AppointmentDetailsHookReturn['createNote']
  updateNoteMutation: AppointmentDetailsHookReturn['updateNote']
  deleteNoteMutation: AppointmentDetailsHookReturn['deleteNote']
  createMessageThreadMutation: AppointmentDetailsHookReturn['createMessageThread']
  refetchParticipants: AppointmentDetailsHookReturn['refetchParticipants']
  onRefetch: () => void
}

export function AppointmentNotesSection({
  appointmentId,
  notesList,
  notePrivileges,
  memberData,
  createNoteMutation,
  updateNoteMutation,
  deleteNoteMutation,
  createMessageThreadMutation,
  refetchParticipants,
  onRefetch
}: AppointmentNotesSectionProps) {
  const router = useRouter()
  const noteModal = useModal<Partial<NoteItem>>()
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState<ThreadParticipant[]>(
    []
  )
  const [isRender, setIsRender] = useState(false)

  const cancelClicked = () => {
    noteModal.close()
    setIsMessageThread(false)
  }

  async function deleteNote(noteId: number | string) {
    deleteNoteMutation.mutate(
      { appointmentNote: { id: Number(noteId) } },
      {
        onSuccess: () => {
          onRefetch()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete note')
        }
      }
    )
  }

  async function createUpdateNote(
    occurance: string,
    noteDetails: string,
    title: string,
    noteData: {
      id?: number | string
      shortDescription?: string
      note?: string
      occurance?: { occurance: string }
    }
  ) {
    const appointmentNotePayload = {
      appointment: {
        id: appointmentId ? appointmentId : ('' as number | string)
      },
      occurance: {
        occurance: occurance
      },
      note: noteDetails,
      shortDescription: title
    }

    if (isEmpty(noteData)) {
      createNoteMutation.mutate(
        { appointmentNote: appointmentNotePayload },
        {
          onSuccess: () => {
            noteModal.close()
            onRefetch()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create note')
          }
        }
      )
    } else {
      const updatePayload = {
        ...appointmentNotePayload,
        id: noteData.id ? noteData.id : ('' as number | string)
      }
      updateNoteMutation.mutate(
        { appointmentNote: updatePayload },
        {
          onSuccess: () => {
            noteModal.close()
            onRefetch()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update note')
          }
        }
      )
    }
  }

  const editNote = (noteData: NoteItem) => {
    noteModal.open(noteData)
  }

  function createMessageThread(subject: string, currentNoteData: NoteItem) {
    let list: { user: { id: number } }[] = []
    participantsList.map((data) => {
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
          member: memberData.member
            ? (memberData.member as number | string)
            : '',
          noteId: currentNoteData.id ? currentNoteData.id : '',
          type: {
            type: 'Appointment'
          },
          participantList: list,
          messageList: []
        }
      },
      {
        onSuccess: () => {
          setIsMessageThread(false)
          onRefetch()
          router.push(
            formatUrl('/circles/noteMessage', {
              component: 'Appointment',
              memberData: JSON.stringify(memberData),
              noteData: JSON.stringify(currentNoteData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to create message thread')
        }
      }
    )
  }

  function isParticipantSelected(index: number) {
    const participant = participantsList[index]
    if (participant) {
      participant.isSelected = !participant.isSelected
    }
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }

  function fetchThreadParticipants(targetNoteData: NoteItem) {
    refetchParticipants().then(({ data }) => {
      if (data) {
        const list = (data as ThreadParticipant[]).map((item) => {
          let object = item
          object.isSelected = false
          return object
        })
        setParticipantsList(list)
        noteModal.open(targetNoteData)
        setIsMessageThread(true)
      }
    })
  }

  const messageThreadClicked = (targetNoteData: NoteItem) => {
    if (targetNoteData.hasMsgThread) {
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Appointment',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(targetNoteData)
        })
      )
    } else {
      fetchThreadParticipants(targetNoteData)
    }
  }

  return (
    <>
      <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
        <View className=" w-full flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              setIsShowNotes(!isShowNotes)
            }}
            className="w-[60%] flex-row"
          >
            <Typography className="font-normal text-[14px] font-bold text-black">
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
                noteModal.open({})
              }}
            />
          ) : (
            <View />
          )}
        </View>

        {notesList.length > 0 && isShowNotes ? (
          <ScrollView className="">
            {notesList.map((data, index) => {
              return (
                <View key={index}>
                  <Note
                    component={'Appointment'}
                    data={data}
                    editNote={
                      editNote as ComponentProps<typeof Note>['editNote']
                    }
                    deleteNote={
                      deleteNote as ComponentProps<typeof Note>['deleteNote']
                    }
                    messageThreadClicked={
                      messageThreadClicked as ComponentProps<
                        typeof Note
                      >['messageThreadClicked']
                    }
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

      {noteModal.isOpen && !isMessageThread ? (
        <View className="mt-[20] h-full w-full">
          <AddEditNote
            component={'Appointment'}
            noteData={noteModal.data ?? {}}
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
            noteData={noteModal.data ?? {}}
            cancelClicked={cancelClicked}
            isParticipantSelected={isParticipantSelected}
            createMessageThread={
              createMessageThread as ComponentProps<
                typeof AddMessageThread
              >['createMessageThread']
            }
            isUpdateParticipants={false}
          />
        </View>
      ) : (
        <View />
      )}
    </>
  )
}
