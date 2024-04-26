import { SortCriterion, SortDirection } from '@/consts/sortOptions'

export interface ContactsResponse extends AppPagination {
  items: ContactContract[]
}

export interface ContactContract {
  id: string
  employeeId: string | null
  personalization: PersonalizationContract
  telephone: {
    number: string
  }
  email: {
    address: string
  } | null
}

export interface ContactParsed {
  id: string
  employeeId: string | null
  personalization: Personalization
  telephone: string
  email?: string
}

export interface AppPagination {
  toPageNumber: number
  fromPageNumber: number
  size?: number
  last?: number
  total?: number
  pageSize?: number
  sorting?: { direction: SortDirection; criterion: SortCriterion }
  isEmployee?: boolean
}

export interface Personalization {
  name: Name
}

export interface Name {
  firstname: string
  lastname: string
  middlename?: string
}

export interface PersonalizationContract {
  name: Name
  dateOfBirth?: string
}
