import express, { Request, Response } from 'express'
import { contactsRouter } from './router/contacts.router.ts'

const PORT = 3000

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', contactsRouter)
app.get('/*', (_req, res) => {
	res.status(404).type('txt').send('404 not found')
})

app.use((error: Error, _req: Request, res: Response) => {
	res.status(500).send(error)
})

app.listen(PORT)
