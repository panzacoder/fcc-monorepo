// export const BASE_URL = 'https://www.familycarecircle.com/fccApi/2.0/';
export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  'http://45.79.147.166:8000/fccApi/2.0/'
export const GET_STATIC_DATA = 'staticms/getAll'
export const USER_LOGIN = 'userms/login'
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
export const GET_MEMBER_FACILITIES = 'facilityms/getMemberFacilities'
export const GET_FACILITY_DETAILS = 'facilityms/getFacilityWithAppointments'
export const CREATE_FACILITY = 'facilityms/create'
