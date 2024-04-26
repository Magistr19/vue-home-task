import { defineStore } from 'pinia'
import {
  ContactContract,
  ContactParsed,
  AppPagination,
  ContactsResponse
} from '../models/contact.model.ts'
import { config } from '@/config.ts'
import { sortOptions } from '@/consts/sortOptions.ts'
import { httpClient } from '@/services/api/httpClient.ts'
import { contactsEndpoint } from '@/services/api/endpoint.ts'

type State = {
  contacts: ContactContract[] | []
  pagination: AppPagination
  contact: ContactContract
}

export const useContacts = defineStore('contacts', {
  state: (): State => ({
    contacts: [],
    pagination: {
      pageSize: config.contactListPageSize,
      toPageNumber: 1,
      fromPageNumber: 1,
      size: 1,
      last: 1,
      total: 1,
      sorting: sortOptions[0].value
    },
    contact: {
      id: '',
      employeeId: null,
      personalization: {
        name: {
          firstname: '',
          lastname: ''
        }
      },
      telephone: {
        number: ''
      },
      email: null
    }
  }),
  getters: {
    parsedContacts({ contacts }): ContactParsed[] {
      return contacts.map((contact) => ({
        id: contact.id,
        employeeId: contact?.employeeId,
        personalization: {
          name: contact.personalization.name
        },
        telephone: contact.telephone.number,
        email: contact.email?.address
      }))
    },
    parsedPagination({ pagination }): AppPagination {
      return pagination
    },
    getNextPageSize({ pagination }): number {
      // if on last page
      if (pagination.toPageNumber === pagination.last) return 0

      // if on pre last page
      if (pagination.toPageNumber === (pagination.last || 1) - 1) {
        return (pagination.total || 1) - pagination.toPageNumber * (pagination.size || 1)
      }

      //otherwise default page size
      return pagination.size || 0
    },
    getPageCount({ pagination }): number {
      return Math.ceil((pagination.total || 1) / (pagination.size || 1))
    },
    getPagesToShow({ pagination }): number[] {
      if (this.getPageCount <= config.paginationMaxSize) {
        return Array.from({ length: this.getPageCount }, (_, index) => index + 1)
      }

      if (pagination.toPageNumber < config.paginationMaxSize) {
        return Array.from({ length: config.paginationMaxSize }, (_, index) => index + 1)
      }

      if (pagination.toPageNumber < this.getPageCount) {
        return Array.from(
          { length: config.paginationMaxSize },
          (_, index) => pagination.toPageNumber - config.paginationMaxSize + index + 2
        )
      }

      if (pagination.toPageNumber === this.getPageCount) {
        return Array.from(
          { length: config.paginationMaxSize },
          (_, index) => pagination.toPageNumber - config.paginationMaxSize + index + 1
        )
      }

      return [1]
    },
    parsedContact({ contact }): ContactParsed {
      return {
        id: contact.id,
        employeeId: contact?.employeeId,
        personalization: {
          name: {
            firstname: contact.personalization.name.firstname,
            lastname: contact.personalization.name.lastname,
            middlename: contact.personalization.name.middlename || ''
          }
        },
        telephone: contact.telephone.number,
        email: contact.email?.address
      }
    }
  },
  actions: {
    async loadContacts(queryIncoming: AppPagination): Promise<void> {
      const queryParams = {
        ...this.pagination,
        ...queryIncoming
      }

      delete queryParams.last
      delete queryParams.size
      delete queryParams.total

      const res: ContactsResponse = await httpClient.get({
        url: contactsEndpoint,
        payload: queryParams
      })

      this.contacts = res.items

      this.pagination = {
        ...this.pagination,
        ...queryIncoming,
        toPageNumber: res.toPageNumber,
        fromPageNumber: res.fromPageNumber,
        size: res.size,
        last: res.last,
        total: res.total
      }
    },
    async loadContactById(id: string): Promise<void> {
      this.resetContact()

      const res: ContactContract = await httpClient.get({
        url: contactsEndpoint + id
      })

      this.contact = res
    },
    resetContact(): void {
      this.contact = {
        id: '',
        employeeId: null,
        personalization: {
          name: {
            firstname: '',
            lastname: ''
          }
        },
        telephone: {
          number: ''
        },
        email: null
      }
    }
  }
})
