'use client'

import { View, ScrollView } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'solito/navigation'
export function FaqScreen() {
  const router = useRouter()
  let titleStyle = 'font-400 w-[95%] text-[15px] text-[#1A1A1A] font-bold'
  let valueStyle = 'font-400 ml-1 w-[95%] text-[15px]  text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mx-2 my-2 w-[95%] items-center">
        <Typography className={titleStyle}>{title}</Typography>
        <Typography className={valueStyle}>{value}</Typography>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <View className="ml-5 mt-[40px] flex-row">
        <Feather
          className="mt-1"
          name={'arrow-left'}
          size={20}
          color={'black'}
          onPress={() => {
            router.back()
          }}
        />
        <Typography className=" flex-1 text-center text-lg font-bold">
          {'FAQ'}
        </Typography>
      </View>
      <ScrollView className="mt-5 w-[95%] self-center rounded-[5px] border-[1px] border-gray-400">
        <Typography className="font-400 my-2 text-center">
          {'FREQUENTLY ASKED QUESTIONS'}
        </Typography>
        {getDetailsView(
          '1.  What are the key benefits of using Family Care Circle ?',
          'FCC will improve communication between multiple Caregivers of a loved one. Appointment tracking helps in keeping up with Notes, Pre-Appointment Labs, Post,Appointment Notes, Instructions and Transportation needs. Here are a few examples of how FCC can help with caregiving.\n\n Request a Family Member or Caregiver in the Family Circle to help with Transportation. Send a quick update to all Family Members about a recent appointment.Make a quick note with date and location about a Fall or other incident for quick reference. Quickly review historical data to answer questions like "When was the last time Mom fell?'
        )}

        {getDetailsView(
          '2.   What is the difference between a Member and a Family Member?',
          'A Member is the focal point of the Family Circle. All information (appointments, incidents, communication, and notes) within the Family Care Circle is focused on the Member. Family Members are the Caregivers of the Member. FCC is focused on successful communication between all Caregivers by tracking key information and having it readily available to all.'
        )}
        {getDetailsView(
          '3.  What is the role of an Authorized Caregiver?',
          'Authorized Caregivers represents the Member in the situations where the Member is not able to approve the creation of the Family Care Circle. An Authorized Caregiver is essentially acting on the Member’s behalf. The Authorized Caregiver and Member are the only ones that can delete the Family Circle’s data. The Authorized Caregiver and Member have unrestricted rights within the Family Care Circle.'
        )}
        {getDetailsView(
          '4.  What is the difference between the role of Admin and Family Member?',
          'Admins are in complete control of FCC and are allowed to expand the Family Circle by inviting others to join. They also have the ability to update & delete Family Members and Caregivers.\n\nFamily Members can create notes, appointments, incidents, and transportation request. Notes can be sent within multiple segments of FCC and are only seen by the users the note is addressed to.'
        )}
        {getDetailsView(
          '5.  How many Family Care Circles can a family member be part of?',
          'A family member can be part of as many Family Care Circles as needed and may easily start a new Family Care Circle around themselves at any time.'
        )}

        {getDetailsView(
          '6.  Why does Family Care Circle require a Family Member to have an email address and phone number?',
          'Email messaging gives Family Care Circle a method to send notifications outside of the application. FCC will also use this gateway to Invite Family Members to join a Family Care Circle, to communicate notes and reminders between Family Members when needed.'
        )}
        {getDetailsView(
          '7.  What if a member or Family Member does not have an email address?',
          'Email addresses are a key part of communication and authentication. We suggest you help all members to setup an e-mail with a Gmail account or another free emailing service.'
        )}
        {getDetailsView(
          '8.  What if a Doctor has multiple locations?',
          'No Problem. When you set up a new Doctor or edit an existing Doctor, you can easily add multiple locations. Then, when creating an appointment, you can select the Doctor and location.'
        )}
        {getDetailsView(
          '9.   What are Facilities?',
          'Facilities are locations where a Member would go for procedures like Blood Test, MRIs, Pet Scans or Surgeries.'
        )}
        {getDetailsView(
          '10.  What is an Incident?',
          'An incident would be health or well-being occurrences that you might want to track to determine frequency and/or help understand if there is an issue to be concerned about. A Fall is a good example of an incident. Trending may be found with a historical review of key information (date, location, and notes). Tracking falls and incidents will help you communicate a concern at the member next Dr Appt.'
        )}
        {getDetailsView(
          '11.  Can I track the purchase of medical devices?',
          'Yes, you can easily enter and track purchases such as Hearing aids or eyeglasses in the purchase management section. You can set reminders for new purchases where you will get emails.'
        )}
        {getDetailsView(
          '12.  How secure is my data?',
          'FCC implements current security practices and will continue to maintain the latest updates to keep your information secure.'
        )}
        {getDetailsView(
          '13.  How do I inactivate a Member’s Family Circle account?',
          'We are sorry to hear you are thinking about closing your account with us. You will find a "Delete" button that will allow you to simply remove a Member’s Circle. This will permanently delete all appointments, incidents, notes, doctors, and facilities associated with that member. Only the Member or an Authorized Caregiver can complete this task.'
        )}
      </ScrollView>
    </View>
  )
}
