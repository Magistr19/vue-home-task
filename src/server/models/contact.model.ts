import { v4 as uuid } from 'uuid'
import { AddContactCommand, UpdateContactCommand } from './contact.commands.ts'
import { InvalidCommandException } from './exceptions.model.ts'
import { exceptionsContent } from '../content/exceptions.content.ts'

export type ContactId = string

export class Contact {
	readonly id: ContactId

	employeeId: string | null

	personalization: Personalization
	telephone: Telephone
	email: Email | null

	isArchived: boolean = false
	dateCreated: string

	constructor(command: AddContactCommand) {
		this.id = uuid()
		this.employeeId = command.isEmployee ? uuid() : null

		this.dateCreated = new Date().toISOString()

		this.personalization = new Personalization(
			new Name(command.firstname, command.lastname, command.middlename),
			command.dateOfBirth
		)

		this.telephone = new Telephone(command.telephone)

		this.email = command.email ? new Email(command.email) : null
	}

	get name() {
		const name = this.personalization.name
		return `${name.firstname} ${name.lastname}${
			name.middlename ? ' ' + name.middlename : ''
		}`
	}

	update(command: UpdateContactCommand) {
		this.personalization.updateName(
			command.firstname,
			command.lastname,
			command.middlename
		)
		this.email = command.email ? new Email(command.email) : null
	}

	archive() {
		if (this.isArchived) {
			const { message, localizedMessage } =
				exceptionsContent.contactIsArchived
			throw new InvalidCommandException(message, localizedMessage)
		}

		this.isArchived = true
	}

	activateEmployment() {
		if (this.employeeId) {
			const { message, localizedMessage } =
				exceptionsContent.contactIsEmployee
			throw new InvalidCommandException(message, localizedMessage)
		}

		this.employeeId = uuid()
	}

	deactivateEmployment() {
		if (!this.employeeId) {
			const { message, localizedMessage } =
				exceptionsContent.contactIsNotEmployee
			throw new InvalidCommandException(message, localizedMessage)
		}

		this.employeeId = null
	}
}

export class Personalization {
	constructor(public name: Name, public dateOfBirth?: string) {}

	updateName(
		firstname: string | undefined,
		lastname: string | undefined,
		middlename: string | undefined
	) {
		this.name = new Name(
			firstname ?? this.name.firstname,
			lastname ?? this.name.lastname,
			middlename ?? this.name.middlename
		)
	}
}

export class Name {
	firstname: string
	lastname: string
	middlename?: string

	constructor(firstname: string, lastname: string, middlename?: string) {
		if (!firstname) {
			const { message, localizedMessage } =
				exceptionsContent.mustNotBeEmpty('firstname')

			throw new InvalidCommandException(message, localizedMessage)
		}

		if (!lastname) {
			const { message, localizedMessage } =
				exceptionsContent.mustNotBeEmpty('lastname')

			throw new InvalidCommandException(message, localizedMessage)
		}

		if (middlename !== undefined && middlename === '') {
			const { message, localizedMessage } =
				exceptionsContent.middlenameMustBeStringOrUndefined
			throw new InvalidCommandException(message, localizedMessage)
		}

		this.firstname = firstname
		this.lastname = lastname
		this.middlename = middlename
	}
}

export class Telephone {
	number: string

	constructor(telephoneNumber: string) {
		const isValid =
			typeof telephoneNumber === 'string' && /^\d+$/.test(telephoneNumber)

		if (!isValid) {
			const { message, localizedMessage } =
				exceptionsContent.telephoneMustBeNumbers
			throw new InvalidCommandException(message, localizedMessage)
		}

		this.number = telephoneNumber
	}
}

export class Email {
	address: string

	constructor(address: string) {
		this.address = address
	}
}
