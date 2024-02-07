const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true,
        },
        published: {
            type: Date,
            // required: true,

        },
        inSeries: {
            type: Boolean
        },
        // authors: [authorSchema],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
)

module.exports = mongoose.model('Book', bookSchema)