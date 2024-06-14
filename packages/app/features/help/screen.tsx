'use client'

import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
export function HelpScreen() {
  const router = useRouter()
  let textStyle = 'my-2 w-[95%] text-[16px] text-black'
  let titleStyle = 'font-400 text-[15px] text-primary font-bold my-2 '
  let valueStyle = 'font-400 text-[15px]  text-primary font-normal'
  let titleStyle1 = 'font-400 text-[15px] text-[#ef6603] font-400 ml-2'
  let valueStyle1 = 'font-400 text-[15px]  text-black font-normal ml-5'
  function getTextView(value: string) {
    return (
      <View className="my-1 ml-5 w-[97%]">
        <Typography className={textStyle}>{value}</Typography>
      </View>
    )
  }
  function getBulletTextView(value: string) {
    return (
      <View className="ml-5 w-[90%] flex-row">
        <View className="my-4 mr-5 h-[10px] w-[10px] rounded-full bg-black" />
        <Typography className={textStyle}>{value}</Typography>
      </View>
    )
  }
  function getBullletTextWithTitle(title: string, value: string) {
    return (
      <View className="ml-5 w-[90%] flex-row">
        <View className="my-4 mr-5 h-[10px] w-[10px] rounded-full bg-black" />
        <Typography className={titleStyle}>{title}</Typography>
        <Typography className={textStyle}>{value}</Typography>
      </View>
    )
  }

  function getPointTextView(title: string, value: string) {
    return (
      <View className="my-2 ml-5 w-[90%]">
        <View className=" flex-row">
          <Feather
            className="mt-1"
            name={'circle'}
            size={15}
            color={'#ef6603'}
          />

          <Typography className={titleStyle1}>{title}</Typography>
        </View>
        <Typography className={valueStyle1}>{value}</Typography>
      </View>
    )
  }
  function getTextView1(title: string, value: string) {
    return (
      <View className="my-2 ml-5 w-[95%] flex-row">
        <Typography className={titleStyle}>
          {title}
          <Typography className={valueStyle}>{value}</Typography>
        </Typography>
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
        <Typography className="ml-[5px] flex-1 text-[18px] font-bold">
          {'Help'}
        </Typography>
      </View>
      <ScrollView>
        <Typography className="text-primary my-2 text-center text-[20px] font-bold">
          {'Family Care Circle Document'}
        </Typography>
        <Typography className="text-primary my-2 ml-5 text-[16px] font-bold">
          {'Family Care Circle:'}
        </Typography>
        {getTextView(
          'Family Care Circle is group of Caregivers taking care of one person called Member. Communication around appointments, transportation needs, and incidents help providethe best care possible along with reducing stress for the Caregivers. '
        )}
        {getTextView1(
          'Member: ',
          ' A Member is an individual who is being taken care by Family Members or Caregivers.'
        )}
        {getTextView(
          'You can create Family Care Circle for your loved ones from home page by clicking on + icon and filling in the member’s contact information. The member will receive an email notifying them of your request to add them to Family Care Circle. We require all Members to acknowledge and approve the tracking of their appointments. Once approved you will become an Admin Caregiver of the person you just created a Family Care Circle for. At this point, you can expand the circle to other Caregivers or if you wish first be familiar with using the app to track appointments, procedures, incidents and/or purchases.\n\nYou can see member cards of these members your home page.'
        )}
        {getTextView1(
          'Caregiver: ',
          ' Caregiver is a person who participates in taking care of Member.'
        )}
        {getTextView(
          'Caregivers can be invited or requested to join Circle from inside your Member card in Family Care Circle menu.\n\nCaregivers can be assigned 2 roles, Admin and FamilyMember. Admin can create/read/update/delete your appointments, incidents and purchases. FamilyMember can only read your appointments, incidents and purchases. Transportation request may be sent to Family Members asking them to accompany your loved one to an upcoming appointment.'
        )}
        {getTextView1(
          'Communication: ',
          ' The best Family Care of a loved one starts with Communication.'
        )}
        {getTextView(
          `The Family Care Circle communication feature will enable you to have notes and discussions readily available at every ${"Doctor's"} appointment. Easily Communicat needs or questions related to appointments, notes, incidents, transportation request and more.`
        )}
        {getBulletTextView(
          `Track communication between family members related to Family Care of your loved ones.`
        )}
        {getBulletTextView(
          `Log and track Incidents to help your loved ones keep up with a member's schedule and health status.`
        )}
        {getBulletTextView(
          `Enter the purchase of medical supplies/equipment either prescribed by doctors or bought over the counter.`
        )}
        {getBulletTextView(
          `Store all doctor's office and facility addresses in one place`
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'Registration: '}
        </Typography>
        {getTextView(
          `Register yourself on Family Care Circle by providing email address and phone number. You will be taken to a screen, where you can create Family Care Circle for yourself or for a loved one.`
        )}
        {getPointTextView(
          `Create For Myself: `,
          `If you want to create Family Care Circle for yourself, click on that button. Your registered details will be appeared. Once you click save, You will be taken to home screen of your own Family Care Circle. You may find requests of others who have requested to join your Caregiver Circle. You can accept or reject these requests.`
        )}
        {getPointTextView(
          `Create For Loved One: `,
          `If you want to create Family Care Circle for someone else, click on that button. You will be asked to fill in details of the person for whom you want to become part of that person’s Family Care Circle. A request will be sent to that person. Once he/she accepts, their Family Care Circle card will appear on your home screen. There are no limits to the number of Circles you can join or administer.`
        )}
        {getPointTextView(
          `Accept Request to create a Circle for you: `,
          `If you received a message to join Family Care Circle from a Family Caregiver. At this point, you would approve the creation of the Circle focused on your care. Please accept the request. Once you accept, you and the Family Caregiver will  be given Admin rights and privileges to use FCC to its full potential.`
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'Home Page '}
        </Typography>
        {getTextView(
          'The FCC Home page will show you all Circles you are included in as Member or Caregiver. These Circles are represented as cards with show upcoming events highlighted. Select which Circle you would like to open and begin to view or create doctors, facilities, and appointments depending on your assigned role. You can log incidents or purchases along with Communicate between Family Members. \n\nWith the button, you can start a new Family Circle for another loved one. You will need to provide valid email id, phone number, first name and last name before sending the request with the button. The loved one will receive an email for the request. They will need to go to the link provided in the email and register for Family Care Circle. Authentication processes are required for all first-time users. Once they login to the app they will be able to accept the Request. \n\nNotification requests will appear for Member/Caregiver requests from others.\n\nAttention notifications appear on the Home page for every Circle highlighting upcoming Appointments, Transportation Requests, Communications, and Incidents.'
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'User Profile: '}
        </Typography>
        {getTextView('User profile consists of three tabs.')}
        {getPointTextView(
          `User Profile: `,
          `This tab shows the User Details, and you will have the ability to edit your details here. Modify your address and time zone and save it with button.`
        )}
        {getPointTextView(
          `Billing: `,
          `This tab gives information about your current subscription plan and allows to renew/purchase after current cycle ends allowing for an ad free FCC experience. If User cancels a renewal, it will end after the current subscription cycle ends returning to using FCC with Ads.`
        )}
        {getPointTextView(
          `Sponsorship: `,
          `Usually, there are kind sponsors who wants to sponsor FCC subscription for their customers, employees, families, or relatives as a token of love and care. Sponsors will provide Sponsor Codes to be entered into the Sponsorship tab and press Save button allowing for an ad free FCC experience.`
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'Caregiver Circle of Family Members '}
        </Typography>
        {getTextView(
          `Caregiver is the person who takes care of a loved one. The Caregiver role can add/update/delete appointments for the loved one. A Caregiver can raise transportation requests and accept/reject to accompany the loved one on their next appointment. Admin Caregivers can invite other Caregivers by clicking on icon to add new Caregiver to the Member’s Family Circle. User can assign a role depending on activities you want to share with the new Caregiver. Currently there are 2 roles, Admin and Family Member. Admin has all rights for the loved one. Family Member cannot invite other Caregivers into the Circle but will be able to enter new or modify appointments, procedures, and incidents. \n\nThe Caregiver Circle tabs shows the list of Caregivers in the Circle by acceptance status.`
        )}
        {getBulletTextView('All - The list of all requests for Caregivers.')}
        {getBulletTextView(
          'Accepted - The list of Caregivers who are already registered and accepted request.'
        )}
        {getBulletTextView(
          'Requested - The list of Caregivers who have been invited to be a part of the Family Circle, however they have not yet accepted the request. So don’t worry, you can easily resend request via email for invitation to join by clicking “Resend".'
        )}
        {getBulletTextView(
          'Rejected - The list of the Individuals, who have rejected your invitation to be your Caregivers. We suggest you contact these individuals explaining the purpose of the application and ask them to accept. At any time, if they decide, they can delete their membership.'
        )}
        {getBulletTextView(
          'Not Yet Registered - The list of Caregivers who have received your Invitation Request, but their Registration with the Family Care Circle App is still pending. You may want to help them thru the registration and authentication process.'
        )}
        {getTextView(
          `By clicking on any name on the list, you can see details of the caregiver. As an Admin, you can change status of Caregiver as Active/Inactive. Active Caregivers will be able to see activities in the circle. Inactive Caregivers will be in the list for historical reasons but will not able to see the activities in the circle. Inactive Caregivers Home page views will only show Family Care Circles in which they are active.\n\nAs in all list views withing FCC, Filter functionality is available:\n\nName- Search by Name of Caregiver.\n\nEmail – Search by the email id of the Caregiver.\n\nRole – Search by the Role (Admin, Family Member) of the Caregiver\n\nMember Status- Search By putting Member Status (Active, Inactive)\n\nAlso, you can search any member with the above functionality from a common "Search icon".`
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Calendar'}
        </Typography>
        {getTextView(
          `A calendar view of member activities. Caregivers can view/add appointments for Doctor or a Facility Appointment at a glance in a month. Caregivers can also report an Incident in the Calendar. Incidents can be added only for past dates.`
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Appointments '}
        </Typography>
        {getTextView(
          `A list of all appointments associated with the Member shown by various statuses.`
        )}
        {getBulletTextView(
          'Upcoming -  The List of future scheduled Appointments and some of past that you will eventually mark as Completed or Cancelled'
        )}
        {getBulletTextView(
          'Completed -  Historical list of completed Appointments'
        )}
        {getBulletTextView(
          'Cancelled -  Historical list of the cancelled Appointments'
        )}
        {getBulletTextView(
          'All -  Complete list of Appointments whether Upcoming, Completed or Cancelled.'
        )}
        {getTextView(
          `The table gives you a quick view of information about Appointments like Date, Type, Doctor/Facility Name, Purpose and Status. It has Actions Column that lists the count of Unread Messages , Unread Reminders , Unread Transportation Requests and Hierarchy of Appointments`
        )}
        {getTextView(
          `Mark Complete/Cancel – A helpful hint appears for past appointments reminding the user to close open appointments by entering any notes to summarize the appointment and if needed communicate with others.`
        )}
        {getTextView(
          `Create Appointments by clicking on sign or open and edit any appointment by + clicking on respective appointment.`
        )}
        {getTextView(
          `Note: An Appointment will be associated with a Doctor or Facility for procedures. You may need to first create the doctor or facility.\n\nEnter details like Appointment Type, Date and Time, Purpose and a brief Description. \n\nSpecify the Doctor/ Facility and location for the Appointment then select to record the Appointment.\n\nYou can edit any changes, if required, for the appointment. A Caregiver has the functionality of adding Notes, Reminders, Reference Appointment and Transportation Request for your Appointment. Communication with other Caregivers can be easily associated with the Appointment by starting the communication from within the appointment detail screen.`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Creating Notes: '}
        </Typography>
        {getTextView(
          `Click + button to add Note. Enter a suitable Title for the Note classifying the note as For Appointment or Post Appointment along with the Note Details and click to create the note.\n\nOnce the Note is created, edit the Note ( ) or start a communication thread( ) about the note. The subject will default to the title, but you can adjust the subject if desired. At this point, you can Select the Participants (from your caregivers) for your Communication and “START MESSAGING” . Only the Participants selected will see the communication. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Creating Reminders: '}
        </Typography>
        {getTextView(
          `Reminders can be added for future Appointments. Click + button to add Reminder. An email will be sent to you, along with a notification will appear within FCC. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Reference Appointment: '}
        </Typography>
        {getTextView(
          `Reference appointments can be used to link the current appointment with another appointment. These helps to keep track of hierarchy of appointments for easy tracking. Click + button to add a reference Appointment. Select the Occurrence (For Appointment or Post Appointment), select the existing Appointment or Create New Reference Appointment. Enter Additional information as needed and Create the Reference Appointment with create button. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Transportation Request: '}
        </Typography>
        {getTextView(
          `Select “Is Transportation Required” and send a request to any Family Member or Friend asking for help. You may also start a request within the Transportation tab by selecting the + button to start the request.\n\nA Transportation Request for Appointment with Caregivers will include adding Transportation Details, cross check the default Date-Time and Location. Select a caregiver or send the request to multiple caregivers requesting them to Accompany the member. Add a Description for the Transportation Request and Send Request . The Caregiver(s) you selected will get an email regarding the Transportation request and a notification will appear within the FCC Home screen. The caregiver can “Accept” or “Reject” the Transportation Request. If request is Rejected, caregiver will have to specify the reason for rejection to help understand why they are not available. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Mark Complete or Cancelled: '}
        </Typography>
        {getTextView(
          `Close an Appointment by first adding any notes to help track key topics related to the appointment. Once this has been completed you should select either or buttons. The Completed button is only visible after the appointment date has passed. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Quick Tool Bar: '}
        </Typography>
        {getTextView(
          `In right most top corner of the page, a quick bar appears with these four functionalities. You can mark your appointment complete , print , create similar or delete the appointment . \n\nCreate similar button will help you quickly create an appointment of a similar type, doctor/facility & description by simply updating the appointment date and time. \n\nDelete Appointment will delete appointment details permanently and requires confirmation before deleting. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Communications'}
        </Typography>
        {getTextView(
          `Communication is key for optimal care. Here you can build and track communication between the circle of family members & caregivers. Only users approved by the Admin are allowed to participate in the communication.\n\nThe list of Communications provides the Date and Time of Communication, Title, Type, Participant List and Message icon with count of unread messages.\n\nFollowing tabs describe the different communications related to specific activities. `
        )}
        {getBulletTextView(
          'All -  All the records of all communications of his Family Circle'
        )}
        {getBulletTextView(
          'General -  A lists the communications created in the general topic category not related to a specific appointment, incident or purchase.'
        )}
        {getBulletTextView(
          'Appointment - A list of communications associated with either Doctor of Facility Appointments.'
        )}
        {getBulletTextView(
          'Incident - A list of communications related to the Incidents.'
        )}
        {getBulletTextView(
          'Purchase- A list of communications related to purchases.'
        )}
        {getTextView(
          `Start a new general communication with the + button or start a communication directly from an appointment, incident or purchase to associate and track the messaging with the event. Select a Title for the Communication and the Participants from your Caregiver Circle and “START MESSAGING”. Only those included in the communication will be able to see and participate. `
        )}
        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Incidents'}
        </Typography>
        {getTextView(
          `Tracking incidents will provide an overall view of the members health. Enter incidents related to well-being, falls, reactions, etc. along with information to help quickly remember specifics of the incident.\n\nThe table has Date and Time of Incident, Title, Type, Location and Message icon with count of unread messages. \n\nWith the + button, you can add Incident details. Note: Incidents are events that have happened and you will only be able to enter dates from the past. Add Date and time, then clarify the type of incident such as accident, falls, vehicle accident, injury, illness, etc. and a brief description of the details. Also, in the second window User can add the location of the incident and click create button.\n\nYou can add one or multiple notes for an incident and start communication by selecting the participants. This communication will always be associated with the incident for future reference.`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Doctors'}
        </Typography>
        {getTextView(
          `Quick view of all Doctors, their specialty and locations. Doctor’s office may have multiple locations and you can always add more locations if needed. Clicking on Doctor’s name, you can access and update Doctor’s information. A list of all previous appointments can be viewed along with the ability to quickly create a new appointment.\n\nAdd a new Doctor by pressing the  + button and provide First Name, Last Name and Specialization. A second window is provided to enter the location of the Doctor’s Offices. A short name will be used for quick identification in Doctor and Facility lookups.`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Facilities'}
        </Typography>

        {getTextView(
          `A quick view of Facilities used for procedures are shown here. The list provides the Name of the Facility, Type, Description and Location. A Facility can have multiple branches at different locations. Clicking on Facility name to access and update Facility information. A list of previous Facilities appointments can be viewed along with the ability to quickly create a new appointment.\n\nAdd a new Facility by pressing the + button and enter the Facility Type and Description. Also, in the second window User can add the location of Facility and add a Facility with create button.\n\nAfter Adding a Facility, User can also edit the changes, if required, for a Facility.\n\nIn edit mode, add multiple locations for a Facility. Delete and Edit location of the Facility.\n\nAppointment for this Facility can also be created here itself. No need to go to Appointments page by clicking + button`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-[#ef6603]">
          {'My Purchases'}
        </Typography>
        {getTextView(
          `This section keeps record of purchased medical supplies prescribed by doctors or bought over the counter. Caregivers can check the medical supplies, a Member has and order more when needed. It reduces confusion between family members & caregivers, allows them to easily track what items need reordering.\n\nThe table has Date and Time of Purchase, Type, Prescribed By and Reminder icon,Message Icon with count of unread messages.\n\nUser can filter Purchases by Date, Type, Prescribed By and Location or a common Search.\n\nWith the + button User can add a Purchase record by filling in details like Purchase Date and Time, Type of Purchase (like Medicines or some medical equipment), check the checkbox if the item User has purchased “Is Prescribed by the Doctor?” and enter the name of the Doctor then add a Description for your Purchase. And create a record for the Purchase.\n\nAfter Adding a Purchase, User can also edit the changes, if required, for the Purchase.\n\nWhen you click a purchase, User goes to that purchase details where Notes and Reminders can be added.`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Creating Notes: '}
        </Typography>
        {getTextView(
          `Once the Note is created, you can associate a Communication Thread( ) with other Caregivers or Family Members by selecting them in the Participant List and select`
        )}

        <Typography className="my-2 ml-5 text-[16px] font-bold text-black">
          {'Creating Reminders: '}
        </Typography>
        {getTextView(`Reminders can be added by selecting + button. `)}
      </ScrollView>
    </View>
  )
}
