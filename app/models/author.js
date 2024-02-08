const mongoose = require('mongoose')

// author is a subDoc not a model

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        // required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    awards: {
        type: String,
        enum: ['New York Times bestseller',
                'Hugo Award',
                'Other'
    ],
        default: 'Other'
    } 
}, { timestamps: true})

module.exports = authorSchema