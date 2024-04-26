export const exceptionsContent = {
	contactNotFound: (id: string) => ({
		message: `Contact with id '${id}' was not found.`,
		localizedMessage: `Контакт з id '${id}' не знайдено.`,
	}),
	mustNotBeEmpty: (fieldName: string) => ({
		message: `Field '${fieldName}' must not be empty.`,
		localizedMessage: `Поле '${fieldName}' не повинно бути порожнім.`,
	}),
	middlenameMustBeStringOrUndefined: {
		message: `Field 'middlename' must be of type string|undefined and must not be an empty string.`,
		localizedMessage: `Поле 'middlename' повинно мати тип string|undefined та не може бути порожньою строкою.`,
	},
	contactIsArchived: {
		message: `This contact is already archived.`,
		localizedMessage: `Цей контакт вже видалено.`,
	},
	contactIsEmployee: {
		message: `This contact is already marked as an employee.`,
		localizedMessage: `Цей контакт вже є співпрацівником.`,
	},
	contactIsNotEmployee: {
		message: `This contact is not marked as an employee.`,
		localizedMessage: `Цей контакт не є співпрацівником.`,
	},
	accessToArchivedContactDenied: {
		message: `Unauthorized operation: reading archived contact.`,
		localizedMessage: `Неавторизована операція: читання архівного контакту.`,
	},
	telephoneMustBeNumbers: {
		message: `Telephone number must contain numbers only.`,
		localizedMessage: `Телефонний номер повинен містити тільки цифри.`,
	},
}
