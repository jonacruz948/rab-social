const axios = require("axios");

const Profile = require("../models/profile");
const db = require("../database/connection");
const { TypeformSchema } = require("../schemas");

const TYPEFORM_API_BASEURL = "https://api.typeform.com/forms";
//LGBTQIA KPsBEmHfw6hC
//Religion DF2TxLtvNr0j
//Women's Rights and Domestic Violence g4TpPu5dOdbT
//Racial Equality and Equity ifwzAcFrnYaf
//Refugees and Immigration  JzmfymIrSpR6
//Public Health LBOp6nCA7q2z
//Industry Regulation & Safety erYQvI08qzJw
//Taxation MwJeihAbW5Uo
//Technology C4VcKS45lFnS
//Energy bkop42wCOBv2
//21st Century Skills & Labor Market zaWlhXrstgRc
//Small Businesses & Entrepreneurship 7sP0kDqwxCCm
//International Diplomacy MsAvaNt59LEL
//Voting & Elections  U0719PcRRPZ8
//Criminal Justice  Eo3uEQ50Ozsq
//Military  L48mCEOgaads
//Education oOBKmZHJAhwq
//Constitutional Rights DZ3DPkHI2qVE

const GET_TYPEFORM_RESPONSE = (formID) =>
  `${TYPEFORM_API_BASEURL}/${formID}/responses`;

const YOUR_PREFERENCE = "zCH8lYyL";
const NEWS_FEEDS_AND_LEARNING = "RB43ap74";
const RANKING_MULTIPLE_CHOICE = "fz23FT3G";
const CARD_DISCUSSION = "u7VOi7pl";

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

const getSpecificTypeformResponse = (req, res) => {
  const { formID, responseID, userID } = req.query;

  const Authorization = `Bearer ${process.env.TYPEFORM_TOKEN}`;
  console.log(GET_TYPEFORM_RESPONSE(formID));
  setTimeout(() => {
    axios
      .get(GET_TYPEFORM_RESPONSE(formID), {
        headers: {
          Authorization,
        },
        params: {
          included_response_ids: responseID,
        },
      })
      .then(async (result) => {
        const {
          data: { items },
        } = result;

        const { answers } = items[0];
        let tags = [];

        answers.forEach((answer) => {
          const {
            field: { id: fieldID },
            choice,
          } = answer;

          if (TypeformSchema[formID][fieldID]["type"] === "choice") {
            const { id: choiceID } = choice;
            if (choiceID === "other") {
              const { other } = choice;
              tags = [...tags, other];
            } else {
              tags = TypeformSchema[formID][fieldID][choiceID]
                ? [...tags, ...TypeformSchema[formID][fieldID][choiceID]]
                : [...tags];
            }
          }
          if (TypeformSchema[formID][fieldID]["type"] === "number") {
            const { number } = answer;
            if (number > 3)
              tags = TypeformSchema[formID][fieldID]["name"]
                ? [...tags, ...TypeformSchema[formID][fieldID]["name"]]
                : [...tags];
          } else {
          }
        });

        private._wrapCon(res, async () => {
          try {
            const { tags: pTags } = await Profile.findOne(
              { userID },
              "tags"
            ).exec();

            let uTags = [];
            switch (formID) {
              case YOUR_PREFERENCE:
                tags = [...new Set(tags)];
                uTags = { ...pTags, action: tags };
                break;
              case NEWS_FEEDS_AND_LEARNING:
                tags = [...new Set(tags)];
                uTags = { ...pTags, board: tags };
                break;
              case RANKING_MULTIPLE_CHOICE:
                uTags = { ...pTags, media: tags };
                break;
              case CARD_DISCUSSION:
                uTags = { ...pTags, media: tags };
                break;
              default:
                return;
            }

            await Profile.updateOne(
              { userID },
              { $set: { tags: uTags } },
              { new: true }
            ).exec();
            res.status(200).send({ result: 0, answers });
          } catch (e) {
            console.log(e);
          }
        });
      });
  });
};

module.exports = {
  getSpecificTypeformResponse,
};
