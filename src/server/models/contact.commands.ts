export interface AddContactCommand {
	firstname: string
	lastname: string
	middlename?: string
	telephone: string
	isEmployee?: boolean
	email?: string
	dateOfBirth?: string
}

export type UpdateContactCommand = Omit<
	AddContactCommand,
	'telephone' | 'isEmployee'
>
