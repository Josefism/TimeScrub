export interface Employee {
  id: number
  companyId: number
  email: string
  name: string
  role: 'EMPLOYEE' | 'ADMIN'
  deletedAt: string | null
  deletedBy?: number | null
}

export type EmployeeFormModel = {
  name: string
  email: string
  role: 'EMPLOYEE' | 'ADMIN'
  password?: string
}

export type EmployeePayload = {
  name: string
  email: string
  role: 'EMPLOYEE' | 'ADMIN'
  password?: string
}
