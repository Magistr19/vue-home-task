import express, { Request, Response } from 'express'
import { ContactsController } from '../controllers/contacts.controller.ts'
import { ContactList } from '../models/contact-list.model.ts'

const router = express.Router()
const controller = new ContactsController(new ContactList())

router.get('/api/contacts', (req: Request, res: Response) =>
	controller.getContacts(req, res)
)
router.post('/api/contacts', (req: Request, res: Response) =>
	controller.addContact(req, res)
)
router.get('/api/contacts/:id', (req: Request, res: Response) =>
	controller.getContact(req, res)
)
router.put('/api/contacts/:id', (req: Request, res: Response) =>
	controller.updateContact(req, res)
)
router.delete('/api/contacts/:id', (req: Request, res: Response) =>
	controller.archiveContact(req, res)
)
router.post(
	'/api/contacts/activate-employment',
	(req: Request, res: Response) => controller.activateEmployment(req, res)
)
router.post(
	'/api/contacts/deactivate-employment',
	(req: Request, res: Response) => controller.deactivateEmployment(req, res)
)

export { router as contactsRouter }
