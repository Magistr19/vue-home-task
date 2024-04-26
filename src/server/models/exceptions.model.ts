export abstract class APIError extends Error {
	abstract readonly status: number
	message: string = 'Some error occured'
	localizedMessage: string = 'Трапилася помилка'

	constructor(message: string, localizedMessage: string) {
		super(message)
		this.message = message
		this.localizedMessage = localizedMessage
	}
}

export class NotFoundException extends APIError {
	status = 404

	constructor(message: string, localizedMessage: string) {
		super(message, localizedMessage)
	}
}
export class InvalidCommandException extends APIError {
	status = 400

	constructor(message: string, localizedMessage: string) {
		super(message, localizedMessage)
	}
}

export class UnauthorizedException extends APIError {
	status = 401

	constructor(message: string, localizedMessage: string) {
		super(message, localizedMessage)
	}
}
