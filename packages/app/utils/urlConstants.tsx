// export const BASE_URL = 'https://www.familycarecircle.com/fccApi/2.0/';
export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  'https://45.79.147.166:8000/fccApi/2.0/'
export const GET_STATIC_DATA = 'staticms/getAll'
export const USER_LOGIN = 'userms/login'
export const USER_LOGOUT = 'userms/logout'
export const CREATE_ACCOUNT = 'regms/create'
export const FORGOT_PASSWORD = 'userms/forgetPassword'
export const RESET_PASSWORD = 'userms/resetPassword'
export const VERIFY_ACCOUNT = 'regms/verify'
export const GET_COUNTRIES = 'countryms/getAll'
export const RESEND_OTP = 'regms/verificationCodeRequest'
export const GET_STATES_AND_TIMEZONES = 'timezonems/getForCountry'
export const GET_MEMBER_DETAILS = 'homems/getClassicMemberDetails'
export const GET_MEMBER_DOCTORS = 'doctorms/getMemberDoctors'
export const GET_DOCTOR_DETAILS = 'doctorms/getDoctorWithAppointments'
export const CREATE_DOCTOR = 'doctorms/create'
export const CREATE_DOCTOR_LOCATION = 'doctorms/createLocation'
export const UPDATE_DOCTOR = 'doctorms/update'
export const UPDATE_DOCTOR_LOCATION = 'doctorms/updateLocation'
export const DELETE_DOCTOR = 'doctorms/delete'
export const DELETE_DOCTOR_LOCATION = 'doctorms/deleteLocation'
export const GET_MEMBER_FACILITIES = 'facilityms/getMemberFacilities'
export const GET_FACILITY_DETAILS = 'facilityms/getFacilityWithAppointments'
export const FIND_CIRCLE = 'memberms/findByEmailOrPhone'
export const CREATE_CIRCLE = 'memberms/createMemberForAuthorisedCaregiver'
export const CREATE_CIRCLE_NO_EMAIL =
  'memberms/createMemberWithoutEmailForAuthorisedCaregiver'
export const JOIN_CIRCLE = 'memberms/create'
export const CREATE_FACILITY = 'facilityms/create'
export const CREATE_FACILITY_LOCATION = 'facilityms/createLocation'
export const DELETE_FACILITY_LOCATION = 'facilityms/deleteLocation'
export const DELETE_FACILITY = 'facilityms/delete'
export const UPDATE_FACILITY = 'facilityms/update'
export const UPDATE_FACILITY_LOCATION = 'facilityms/updateLocation'
export const GET_APPOINTMENTS = 'appointmentms/getFilteredList'
export const GET_DOCTOR_FACILITIES =
  'appointmentms/getMemberDoctorsFacilitiesByType'
export const GET_EVENTS = 'eventms/getFilteredList'
export const GET_EVENT_DETAILS = 'eventms/get'
export const GET_MEMBER_MENUS = 'memberms/getMemberWithMenus'
export const GET_APPOINTMENT_DETAILS =
  'appointmentms/getAppointmentWithPreviousAppointment'
export const DELETE_APPOINTMENT_NOTE = 'appointmentms/deleteNote'
export const CREATE_APPOINTMENT_NOTE = 'appointmentms/createNote'
export const UPDATE_APPOINTMENT_NOTE = 'appointmentms/updateNote'
export const DELETE_EVENT_NOTE = 'eventms/deleteNote'
export const DELETE_EVENT = 'eventms/delete'
export const CREATE_EVENT_NOTE = 'eventms/createNote'
export const UPDATE_EVENT_NOTE = 'eventms/updateNote'
export const CREATE_APPOINTMENT = 'appointmentms/create'
export const UPDATE_APPOINTMENT = 'appointmentms/update'
export const DELETE_APPOINTMENT = 'appointmentms/delete'
export const GET_APPOINTMENT_NOTE = 'appointmentms/getNote'
export const GET_EVENT_NOTE = 'eventms/getNote'
export const DELETE_APPOINTMENT_REMINDER = 'appointmentms/deleteReminder'
export const CREATE_APPOINTMENT_REMINDER = 'appointmentms/createReminder'
export const DELETE_EVENT_REMINDER = 'eventms/deleteReminder'
export const CREATE_EVENT_REMINDER = 'eventms/createReminder'
export const UPDATE_EVENT_REMINDER = 'eventms/updateReminder'
export const GET_APPOINTMENT_DOCTORS = 'appointmentms/getMemberDoctorLocations'
export const GET_APPOINTMENT_FACILITIES =
  'appointmentms/getMemberFacilityLocations'
export const UPDATE_APPOINTMENT_REMINDER = 'appointmentms/updateReminder'
export const UPDATE_APPOINTMENT_STATUS = 'appointmentms/updateStatus'
export const UPDATE_EVENT_STATUS = 'eventms/updateStatus'
export const UPDATE_APPOINTMENT_TRANSPORTATION = 'apptransportms/delete'
export const GET_TRANSPORTATION_MEMBER_LIST =
  'memberms/getTransportationUserList'
export const CREATE_TRANSPORTATION = 'apptransportms/create'
export const CREATE_TRANSPORTATION_EVENT = 'eventtransportms/create'
export const CREATE_TRANSPORTATION_REMINDER = 'apptransportms/createReminder'
export const UPDATE_TRANSPORTATION_REMINDER = 'apptransportms/updateReminder'
export const DELETE_TRANSPORTATION_REMINDER = 'apptransportms/deleteReminder'
export const CREATE_TRANSPORTATION_REMINDER_EVENT =
  'eventtransportms/createReminder'
export const UPDATE_TRANSPORTATION_REMINDER_EVENT =
  'eventtransportms/updateReminder'
export const DELETE_TRANSPORTATION_REMINDER_EVENT =
  'eventtransportms/deleteReminder'
export const UPDATE_TRANSPORTATION = 'apptransportms/update'
export const UPDATE_TRANSPORTATION_EVENT = 'eventtransportms/update'
export const DELETE_TRANSPORTATION = 'apptransportms/delete'
export const DELETE_TRANSPORTATION_EVENT = 'eventtransportms/delete'
export const RESEND_TRANSPORTATION_REQUEST =
  'apptransportms/resendTransportationRequest'
export const RESEND_TRANSPORTATION_REQUEST_EVENT =
  'eventtransportms/resendTransportationRequest'
export const CANCEL_TRANSPORTATION_REQUEST =
  'apptransportms/cancelTransportationRequest'
export const CANCEL_TRANSPORTATION_REQUEST_EVENT =
  'eventtransportms/cancelTransportationRequest'
export const GET_THREAD_PARTICIPANTS = 'memberms/getMessageThreadParticipants'
export const UPDATE_THREAD_PARTICIPANTS = 'messageThreadms/updateParticipants'
export const CREATE_MESSAGE_THREAD = 'messageThreadms/create'
export const UPDATE_MESSAGE_THREAD = 'messageThreadms/update'
export const CREATE_EVENT = 'eventms/create'
export const UPDATE_EVENT = 'eventms/update'
export const GET_INCIDENTS = 'incidentms/getMemberIncidents'
export const GET_INCIDENT_DETAILS = 'incidentms/getIncident'
export const DELETE_INCIDENT_NOTE = 'incidentms/deleteNote'
export const DELETE_INCIDENT = 'incidentms/delete'
export const CREATE_INCIDENT_NOTE = 'incidentms/createNote'
export const CREATE_INCIDENT = 'incidentms/create'
export const UPDATE_INCIDENT = 'incidentms/update'
export const UPDATE_INCIDENT_NOTE = 'incidentms/updateNote'
export const GET_MEMBER_THREADS = 'messageThreadms/getMemberThreads'
export const GET_THREAD = 'messageThreadms/getThread'
export const GET_PRESCRIPTION_LIST = 'medicinems/getFilteredList'
export const GET_PRESCRIPTION = 'medicinems/get'
export const DELETE_PRESCRIPTION = 'medicinems/delete'
export const GET_PHARMACY_LIST = 'facilityms/getMemberPharmacyList'
export const GET_ACTIVE_DOCTORS = 'doctorms/getActiveDoctors'
export const GET_INCIDENT_NOTE = 'incidentms/getNote'
export const CREATE_PRESCRIPTION = 'medicinems/create'
export const UPDATE_PRESCRIPTION = 'medicinems/update'
export const GET_MEDICAL_DEVICES = 'purchasems/getFilteredList'
export const GET_MEDICAL_DEVICE_DETAILS = 'purchasems/getPurchase'
export const DELETE_MEDICAL_DEVICE = 'purchasems/delete'
export const CREATE_MEDICAL_DEVICE = 'purchasems/create'
export const UPDATE_MEDICAL_DEVICE = 'purchasems/update'
export const CREATE_MEDICAL_DEVICE_NOTE = 'purchasems/createNote'
export const UPDATE_MEDICAL_DEVICE_NOTE = 'purchasems/updateNote'
export const DELETE_MEDICAL_DEVICE_NOTE = 'purchasems/deleteNote'
export const GET_MEDICAL_DEVICE_NOTE = 'purchasems/getNote'
export const DELETE_MEDICAL_DEVICE_REMINDER = 'purchasems/deleteReminder'
export const CREATE_MEDICAL_DEVICE_REMINDER = 'purchasems/createReminder'
export const UPDATE_MEDICAL_DEVICE_REMINDER = 'purchasems/updateReminder'
export const GET_MEMBER_CAREGIVERS = 'caregiverms/getMemberCaregivers'
export const GET_CAREGIVER_DETAILS = 'caregiverms/get'
export const CREATE_CAREGIVER = 'caregiverms/create'
export const UPDATE_CAREGIVER = 'caregiverms/update'
export const DELETE_CAREGIVER = 'caregiverms/delete'
export const FIND_CAREGIVER_BY_EMAIL_PHONE = 'memberms/findByEmailOrPhone'
export const RESEND_CAREGIVER_REQEST = 'memberms/resendRequest'
export const GET_TC_HTML_CONTENT = 'apTermsConditions/geActive'
export const GET_CONSOLIDATED_FILTER_OPTIONS = 'homems/getFilterOptions'
export const GET_CONSOLIDATED_DETAILS = 'homems/getConsolidatedMemberDetails'
export const GET_WEEK_DETAILS = 'homems/getClassicWeekDetails'
export const GET_FILTER_CONSOLIDATED_DETAILS =
  'homems/getFilteredConsolidatedMemberDetails'
export const SHARE_CONTACT_INFO = 'infoSharingMs/create'
export const ACCEPT_SHARED_INFO = 'infoSharingMs/accept'
export const REJECT_SHARED_INFO = 'infoSharingMs/reject'
export const REJECT_MEMBER_REQUEST = 'memberms/rejectMembershipRequest'
export const ACCEPT_MEMBER_REQUEST = 'memberms/acceptMembershipRequest'
export const SEND_CALENDAR_INVITE = 'calendarEventMS/syncAppointmentToCalendar'
export const GET_CALENDER_ITEMS = 'memberms/getMemberCalenderMonthItems'
export const GET_USER_PROFILE = 'memberms/getProfile'
export const AUTO_SUBSCRIPTION = 'pg/makeSubscriptionAutocharge'
export const RENEW_SUBSCRIPTION = 'pg/renewSubscription'
export const MANUAL_SUBSCRIPTION = 'pg/makeSubscriptionManualCharge'
export const UPGRADE_PLAN = 'pg/upgradeSubscription'
export const CANCEL_SUBSCRIPTION = 'pg/cancelOnCurrentSubscriptionEnd'
export const DELETE_ACCOUNT = 'userms/deleteAccount'
export const CHECK_VALID_CREDENTIAL = 'userms/checkValidCredential'
export const UPDATE_PROFILE = 'memberms/updateUserProfile'
export const UPDATE_MEMBER_ADDRESS = 'memberms/updateAddress'
export const GET_ALL_PLANS = 'planms/geAllPlans'

export const APPLE_SUCCESS_PAYMENT_FOR_OUR_SERVER = 'apple/paymentSuccess'
export const PAYMENT_SUCCESS = 'pg/checkout-session'
export const PAYMENT_FAIL = 'pg/cancel-session'
export const IOS_RECEIPT_VERIFICATION_URL =
  'https://buy.itunes.apple.com/verifyReceipt'
export const PAYMENT_CHECK_OUT_SESSION = 'pg/makePayment'
export const PAYMENT_GET_PAYMENT_CONFIG = 'pg/config'
export const UPDATE_SPONSOR_CODE = 'memberms/updateSponsorCode'
export const GET_CARD_LIST = 'cardms/getlist'
export const ADD_CARD = 'cardms/createCard'
export const DELETE_CARD = 'cardms/detachCard'
export const REFER_FRIEND = 'referralms/referFriend'
export const GET_MEMBER_PROFILE = 'memberms/getMemberDetails'
export const DELETE_AUTHORIZED_CAREGIVER =
  'memberms/deleteMemberForAuthorisedCaregiver'
export const DELETE_MEMBER = 'memberms/deleteMember'
export const DELETE_CAREGIVER_CIRCLE = 'memberms/deleteCaregiver'
export const UPDATE_MEMBER_AUTHORIZED_CAREGIVER =
  'memberms/updateMemberForAuthorisedCaregiver'
export const UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS =
  'memberms/updateAddressForAuthorisedCaregiver'
