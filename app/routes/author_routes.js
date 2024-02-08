const express = require('express')
const passport = require('passport')
const Book = require('../models/book')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

///
// routes
///


// CREATE
// POST /authors/dgd65g41d6f54gd65
router.post('/authors/:bookId', removeBlanks, (req, res, next) => {
	const author = req.body.author
    const bookId = req.params.bookId

	Book.findById(bookId)
        .then(handle404)
		.then((book) => {
            book.authors.push(author)
			return book.save()
		})
        .then(book => res.status(201).json({ book: book }))
		.catch(next)
})

// UPDATE
// PATCH /authors/5a7db6c74d5/65s4f6s54f65
router.patch('/authors/:bookId/:authorId', requireToken, removeBlanks, (req, res, next) => {
	const { bookId, authorId } = req.params

	Book.findById(bookId)
		.then(handle404)
		.then((book) => {
            const theAuthor = book.authors.id(authorId)
            // console.log('this is the author', authorId)
            // console.log('this is the book', bookId)
			requireOwnership(req, book)
            theAuthor.set(req.body.author)
			return book.save()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
// DELETE /authors/5a7db6c74d5/65s4f6s54f65
router.delete('/authors/:bookId/:authorId', requireToken, removeBlanks, (req, res, next) => {
	const { bookId, authorId } = req.params

	Book.findById(bookId)
		.then(handle404)
		.then((book) => {
            const theAuthor = book.authors.id(authorId)
			requireOwnership(req, book)
            theAuthor.deleteOne()
			return book.save()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
