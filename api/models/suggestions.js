const mongoose = require('mongoose')

const suggestionSchema = mongoose.Schema({
    fullname: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
})

const Suggestions = mongoose.model('suggestions', suggestionSchema)

module.exports = Suggestions
