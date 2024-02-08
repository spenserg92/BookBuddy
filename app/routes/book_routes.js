// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for books
const Book = require('../models/book')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /books
router.get('/books', (req, res, next) => {
	Book.find()
		.then((books) => {
			// `books` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return books.map((book) => book.toObject())
		})
		// respond with status 200 and JSON of the books
		.then((books) => res.status(200).json({ books: books }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /books/5a7db6c74d55bc51bdf39793
router.get('/books/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Book.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "book" JSON
		.then((book) => res.status(200).json({ book: book.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /books
router.post('/books', requireToken, (req, res, next) => {
	// set owner of new book to be current user
	req.body.book.owner = req.user.id

	Book.create(req.body.book)
		// respond to succesful `create` with status 201 and JSON of new "book"
		.then((book) => {
			res.status(201).json({ book: book.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /books/5a7db6c74d55bc51bdf39793
router.patch('/books/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.book.owner

	Book.findById(req.params.id)
		.then(handle404)
		.then((book) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, book)

			// pass the result of Mongoose's `.update` to the next `.then`
			return book.updateOne(req.body.book)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /books/5a7db6c74d55bc51bdf39793
router.delete('/books/:id', requireToken, (req, res, next) => {
	Book.findById(req.params.id)
		.then(handle404)
		.then((book) => {
			// throw an error if current user doesn't own `book`
			requireOwnership(req, book)
			// delete the book ONLY IF the above didn't throw
			book.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
