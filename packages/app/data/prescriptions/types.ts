import type { DomainPrivileges } from '../types.d'

export interface PrescriptionType {
  id: number
  type: string
}

export interface PrescriptionStatus {
  id: number
  status: string
}

export interface PrescriptionListItem {
  id: number
  type: string
  name: string
  doctorname: string
  pharmacy: string
  startDate: string
  endDate: string
  status: string
}

export interface PrescriptionDetail {
  id: number
  name: string
  strength: string
  doctorName: string
  pharmacy: string
  prescribedDate: string
  startDate: string
  endDate: string
  instructions: string
  notes: string
  type: PrescriptionType
  status: PrescriptionStatus
}

export interface PrescriptionListResponse {
  domainObjectPrivileges: DomainPrivileges
  medicineList: PrescriptionListItem[]
}

export interface PrescriptionDetailResponse {
  domainObjectPrivileges: DomainPrivileges
  medicine: PrescriptionDetail
}

export interface GetPrescriptionListParams {
  memberId: number | string
  name?: string
  pharmacy?: string
  prescribedBy?: string
  type?: { type: string }
}

export interface GetPrescriptionParams {
  id: number | string
  memberId: number | string
}

export interface PrescriptionMedicineInput {
  id: number | string | null
  name: string
  prescribedDate: string
  startDate: string
  endDate: string
  instructions: string
  notes: string
  strength: string
  pharmacy: string
  doctorName: string
  facilityid: number | string
  doctorid: number | string
  member: { id: number | string }
  type: { id: number | string }
}

export interface CreatePrescriptionParams {
  medicine: PrescriptionMedicineInput
}

export interface UpdatePrescriptionParams {
  medicine: PrescriptionMedicineInput
}

export interface DeletePrescriptionParams {
  id: number | string
  memberId: number | string
}
