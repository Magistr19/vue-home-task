import { Request, Response } from 'express'
import { APIError } from '../models/exceptions.model.ts'
import { ContactList } from '../models/contact-list.model.ts'

export class ContactsController {
	constructor(private contactList: ContactList) {}

	getContacts(req: Request, res: Response) {
		this.handleRequest(res, () => {
			const data = this.contactList.getContacts(req.query)
			res.json(data)
		})
	}

	addContact(req: Request, res: Response) {
		this.handleRequest(res, () => {
			const id = this.contactList.addContact(req.body)
			res.status(200).send(id)
		})
	}

	getContact(req: Request, res: Response) {
		this.handleRequest(res, () => {
			const data = this.contactList.getContact(req.params.id)
			res.json(data)
		})
	}

	updateContact(req: Request, res: Response) {
		this.handleRequest(res, () => {
			this.contactList.updateContact(req.params.id, req.body)
			res.status(200).send()
		})
	}

	archiveContact(req: Request, res: Response) {
		this.handleRequest(res, () => {
			this.contactList.archiveContact(req.params.id)
			res.status(200).send()
		})
	}

	activateEmployment(req: Request, res: Response) {
		this.handleRequest(res, () => {
			this.contactList.activateEmployment(req.body.id)
			res.status(200).send()
		})
	}

	deactivateEmployment(req: Request, res: Response) {
		this.handleRequest(res, () => {
			this.contactList.deactivateEmployment(req.body.id)
			res.status(200).send()
		})
	}

	private handleRequest(res: Response, handler: any) {
		try {
			handler()
		} catch (error: unknown) {
			if (error instanceof APIError) {
				res.status(error.status).send(error)
			} else {
				throw error
			}
		}
	}
}
