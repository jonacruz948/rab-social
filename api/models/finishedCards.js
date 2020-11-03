const mongoose = require('mongoose')

const finishedcardsSchema = mongoose.Schema({
    userID: {
        type: String, 
        required: true
    },
    cards: [{
        id: {
            type: String
        }
    }]
})

const FinishedCards = mongoose.model('finished_cards', finishedcardsSchema)

module.exports = FinishedCards
