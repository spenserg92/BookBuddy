// give some intitial books in my database
// can test routes with it

// 'npm run seed'

const mongoose = require('mongoose')
const Book = require('./book')
const db = require('../../config/db')

const starterBooks = [
    {name: 'The Wheel of Time', genre: 'Fantasy', inSeries: true},
    {name: 'Red Rising', genre: 'Fantasy', inSeries: true},
    {name: 'Tress of the Emerald Sea', genre: 'Fantasy', inSeries: false},
    {name: 'Uncommon', genre: 'Self-Help', inSeries: false},
]

mongoose.connect(db, {useNewUrlParser: true})
    .then(() => {
        Book.deleteMany({owner: null})
        .then(deletedBooks => {
            console.log('deleted books in seed script', deletedBooks)

            Book.create(starterBooks)
                .then(newBooks => {
                    console.log('new books added to the db: \n', newBooks)
                    mongoose.connection.close()
                })
                .catch(error => {
                    console.log('an error has occurred: \n', error)
                    mongoose.connection.close()
                })
        })
        .catch(error => {
            console.log('an error has occurred: \n', error)
            mongoose.connection.close()
        })
    })
    .catch(error => {
        console.log('an error has occurred: \n', error)
        mongoose.connection.close()
    })