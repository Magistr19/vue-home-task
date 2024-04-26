import { AddContactCommand, UpdateContactCommand } from './contact.commands.ts'
import { Contact, ContactId } from './contact.model.ts'
import { mockContacts } from '../mocks/contacts.ts'
import { config } from '../config.ts'
import { exceptionsContent } from '../content/exceptions.content.ts'
import { NotFoundException, UnauthorizedException } from './exceptions.model.ts'

export class ContactList {
	private contacts: Contact[] = []

	query = Listing.defaultQuery

	constructor() {
		this.seedTestData()
	}

	seedTestData() {
		mockContacts.forEach(command => this.addContact(command))
	}

	getContacts(reqQuery: Record<string, any> = {}) {
		this.query = Listing.mergeQueries(reqQuery, this.query)

		if (this.query.toPageNumber < this.query.fromPageNumber) {
			this.query.toPageNumber = this.query.fromPageNumber
		}

		return Listing.paginate(
			Listing.sort(
				Listing.filter(this.contacts, this.query),
				this.query.sorting
			),
			this.query
		)
	}

	getContact(id: ContactId) {
		const contact = this.getById(id)

		if (contact.isArchived) {
			const { message, localizedMessage } =
				exceptionsContent.accessToArchivedContactDenied
			throw new UnauthorizedException(message, localizedMessage)
		}

		return contact
	}

	addContact(command: AddContactCommand) {
		const contact = new Contact(command)
		this.contacts.push(contact)
		return contact.id
	}

	updateContact(id: ContactId, command: UpdateContactCommand) {
		const contact = this.getById(id)
		contact.update(command)
	}

	archiveContact(id: ContactId) {
		const contact = this.getById(id)
		contact.archive()
	}

	activateEmployment(id: ContactId) {
		const contact = this.getById(id)
		contact.activateEmployment()
	}

	deactivateEmployment(id: ContactId) {
		const contact = this.getById(id)
		contact.deactivateEmployment()
	}

	private getById(id: ContactId) {
		const contact = this.contacts.find(contact => contact.id === id)

		if (!contact) {
			const { message, localizedMessage } =
				exceptionsContent.contactNotFound(id)
			throw new NotFoundException(message, localizedMessage)
		}

		return contact
	}
}

export interface PagingQuery {
	pageSize: number
	fromPageNumber: number
	toPageNumber: number
}

export interface ContactsQuery extends PagingQuery {
	sorting: SortCommand
	isEmployee?: boolean
	isArchived?: boolean
}

export interface SortCommand {
	direction: SortDirection
	criterion: SortCriterion
}

export enum SortDirection {
	Ascending,
	Descending,
}

export enum SortCriterion {
	Name,
	DateCreated,
}

export class Listing {
	static readonly defaultSortCommand = {
		direction: SortDirection.Descending,
		criterion: SortCriterion.DateCreated,
	}

	static readonly defaultQuery = {
		sorting: Listing.defaultSortCommand,
		pageSize: 10,
		fromPageNumber: 1,
		toPageNumber: 1,
	}

	static mergeQueries(
		queryIncoming: Record<string, any>,
		queryCurrent: ContactsQuery
	): ContactsQuery {
		const isNumeric = (value: any) => {
			return (
				!isNaN(value) &&
				typeof value !== 'boolean' &&
				value !== null &&
				value !== '' &&
				!Array.isArray(value)
			)
		}

		const query = {
			...queryCurrent,
			...queryIncoming,
		} as Record<string, any>

		const merged = Object.keys(query).reduce((acc, fieldName) => {
			let converted: number | boolean | SortCommand | undefined

			const value = query[fieldName]

			if (isNumeric(value)) {
				converted = Number(value)
			}

			if (['true', 'false'].includes(value)) {
				converted =
					value === 'true'
						? true
						: value === 'false'
						? false
						: undefined
			}

			if (fieldName === 'sorting') {
				converted = {
					criterion: Number(query.sorting?.criterion),
					direction: Number(query.sorting?.direction),
				}
			}

			if (converted !== null && converted !== undefined) {
				acc[fieldName] = converted
			}

			return acc
		}, {} as Record<string, any>)

		return merged as ContactsQuery
	}

	static paginate(itemsList: Contact[], paging: PagingQuery) {
		const start = (paging.fromPageNumber - 1) * paging.pageSize
		const end = paging.toPageNumber * paging.pageSize

		const items = [...itemsList].slice(start, end)

		return {
			items,
			total: itemsList.length,
			size: paging.pageSize,
			last: itemsList.length
				? Math.ceil(itemsList.length / paging.pageSize)
				: 0,
			fromPageNumber: paging.fromPageNumber,
			toPageNumber: paging.toPageNumber,
		}
	}

	static sort(
		list: Contact[],
		sortCommand: SortCommand = this.defaultSortCommand
	) {
		const sortedList =
			sortCommand.criterion === SortCriterion.Name
				? Listing.sortByName(list)
				: sortCommand.criterion === SortCriterion.DateCreated
				? Listing.sortByDateCreated(list)
				: [...list]

		return sortCommand.direction === SortDirection.Ascending
			? sortedList
			: sortedList.reverse()
	}

	protected static sortByName(list: Contact[]) {
		const collator = new Intl.Collator(config.locale)

		return [...list].sort((a: Contact, b: Contact) =>
			collator.compare(a.name, b.name)
		)
	}

	protected static sortByDateCreated(list: Contact[]) {
		return [...list].sort(
			(a: Contact, b: Contact) =>
				new Date(a.dateCreated).getTime() -
				new Date(b.dateCreated).getTime()
		)
	}

	static filter(list: Contact[], query: ContactsQuery) {
		const filteredByEmployment = Listing.filterEmployees(list, query)
		const filteredByAchivationStatus = Listing.filterArchived(
			filteredByEmployment,
			query
		)

		return filteredByAchivationStatus
	}

	protected static filterEmployees(list: Contact[], query: ContactsQuery) {
		if (query.isEmployee === undefined) return list

		return list.filter(contact =>
			query.isEmployee
				? Boolean(contact.employeeId)
				: !Boolean(contact.employeeId)
		)
	}

	protected static filterArchived(list: Contact[], query: ContactsQuery) {
		if (query.isArchived === undefined) return list

		return list.filter(contact => contact.isArchived === query.isArchived)
	}
}
