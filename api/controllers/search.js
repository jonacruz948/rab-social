var db = require('../database/connection');
var board_model = require('../models/boards');
var profile_model = require('../models/profile');
var express_helper = require('../helpers/express');
const cards_model = require('../models/cards');

var private = {
    _wrapCon: function (res, callback) {
        db.connect().then(callback, () => {
            express_helper.handle_error(err, res);
        })
    },
}


var handler = {

    find: function (req, res) {
        //get the term and userID from req, 
        const term = req.query.keywords;
        const userID = req.query.userID;
        let response = {}

        private._wrapCon(res, () => {
            let regex = new RegExp(".*" + term + ".*", 'i');
            if (req.query.userID !== null) {
                profile_model.findOne({ userID }, (error, profile) => {
                    if (error) console.error("Getting Profile Failed", error);

                    if (profile) {
                        profile.searches.push({ keyword: term });
                        profile_model.update({ _id: profile._id }, { searches: profile.searches }, (er, updatedProfile) => {
                            if (er) console.error("Updating profile failed", er)
                            else console.info("Profile Update Success.", updatedProfile);
                        })
                    } else {
                        let newProfile = new profile_model();
                        newProfile.userID = userID;
                        newProfile.searches.push({ keyword: term });
                        newProfile.save((er, savedProfile) => {
                            console.log("profile created", er, savedProfile);
                        })
                    }
                })
            }
            board_model.find({ $or: [{ name: regex }, { purpose: regex }] }, function (err, boards) {
                if (err) express_helper.handle_error(err, res)

                response.boards = boards
                cards_model.all((cards) => {
                    let return_cards = [];
                    // for(var i=0; i<cards.length; i++){
                    //     if(regex.test(cards[i].title + cards[i].description + cards[i].orginization.name + cards[i].orginization.description)
                    //         || cards[i].tags.includes(term)
                    //         || cards[i].type.toUpperCase().includes(term.toUpperCase())
                    //         || cards[i].location?.city?.toUpperCase().includes(term.toUpperCase())
                    //         || cards[i].location?.state?.toUpperCase().includes(term.toUpperCase())
                    //         || cards[i].location?.zip?.toUpperCase().includes(term.toUpperCase())
                    //         || cards[i].location?.address?.toUpperCase().includes(term.toUpperCase())
                    //     )
                    //     {
                    //         return_cards.push(cards[i])
                    //     }
                    // }
                    response.cards = return_cards;
                    res.send(response);
                })

            })
        });
    },

    view: function (req, res) {
        private._wrapCon(res, () => {
            profile_model.findOne({ userID: req.body.userID }, (error, profile) => {
                if (error) express_helper.handle_error(error, res)
                if (profile !== null) {
                    profile_model.update({ _id: profile._id }, { views: [...profile.views, { type: req.body.type, id: req.body.cbID }] }, (er, updateRes) => {
                        if (er) express_helper.handle_error(er, res)
                        res.status(200).send(updateRes);
                    })
                } else {
                    let newProfile = new profile_model();
                    newProfile.userID = req.body.userID
                    newProfile.views = [{ type, id: req.body.cbID }]
                    newProfile.save((er, savedProfile) => {
                        if (er) express_helper.handle_error(er, res)
                        res.status(200).send(savedProfile);
                    })
                }
            })
        })
    }
}

module.exports = handler;