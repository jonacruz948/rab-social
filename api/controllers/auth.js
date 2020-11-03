const AWS = require("aws-sdk");

var db = require("../database/connection");
const User = require("../models/users");
const Profile = require("../models/profile");
const express_helper = require("../helpers/express");
const {
  AWS: { accessKeyId, secretAccessKey, region, bucket },
} = require("../config");

const DEFAULT_PASSWORD = "12345";

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

var auth = {
  login: function (req, res) {
    private._wrapCon(res, async () => {
      const { email, userName, password } = req.body;
      let user;

      if (!email) {
        try {
          user = await User.findOne({ userName }).exec();
        } catch (err) {
          if (err) return express_helper.handle_error(err, res);
        }
      } else {
        try {
          user = await User.findOne({ email }).exec();
        } catch (e) {
          if (err) return express_helper.handle_error(err, res);
        }
      }

      if (user) {
        User.findByCredentials(user.email, password).then(
          (user) => {
            user.generateAuthToken().then(
              function (token) {
                const { _id: userID } = user;
                Profile.findOne({ userID }, (err, profile) => {
                  if (err) return express_helper.handle_error(err, res);
                  res.status(200).send({ result: 0, user, token, profile });
                });
              },
              function (error) {
                express_helper.handle_error(error, res);
              }
            );
          },
          (error) => {
            console.log(error);
            res.status(200).send({ result: 1, message: error });
          }
        );
      } else {
        res.status(404).send({ result: 1, message: "Invalid credentials" });
      }
    });
  },

  register: function (req, res) {
    const file = req.file;
    const { userName, fullName, password, email, city, state } = req.body;

    const s3bucket = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const params = {
      Bucket: `${bucket}/profile-avatars`,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3bucket.upload(params, async (err, data) => {
      if (err) {
        res.status(500).json({ error: true, message: err });
      } else {
        const { Location } = data;
        private._wrapCon(res, async () => {
          try {
            const user = await User.create({
              fullName,
              userName,
              password,
              email,
              city,
              state,
            });

            const nProfile = {
              userID: user._id,
              fullName,
              userName,
              actions: [],
              avatar: Location,
            };

            Profile.create(nProfile, (err, profile) => {
              if (err) return express_helper.handle_error(err, res);
              user.generateAuthToken().then(
                (token) => {
                  res.status(201).send({ result: 0, user, token, profile });
                },
                (err) => {
                  express_helper.handle_error(err, res);
                }
              );
            });
          } catch (e) {
            console.log(e);
            if (e.code === 11000) {
              const message =
                e.keyPattern.userName === 1
                  ? "Username is already in use"
                  : "Email is duplicated";
              res.status(200).send({ result: 1, message });
            } else {
              return express_helper.handle_error(e, res);
            }
          }
        });
      }
    });
  },

  loginWithSocial: (req, res) => {
    const { fullName, userName, avatar, email } = req.body;

    private._wrapCon(res, async () => {
      const user = await User.findOne({ email }).exec();
      if (user) {
        user.generateAuthToken().then(
          function (token) {
            const { _id: userID } = user;
            Profile.findOne({ userID }, (err, profile) => {
              if (err) return express_helper.handle_error(err, res);
              res.status(200).send({ result: 0, user, token, profile });
            });
          },
          function (error) {
            express_helper.handle_error(error, res);
          }
        );
      } else {
        const password = DEFAULT_PASSWORD;

        try {
          const user = await User.create({
            fullName,
            userName,
            email,
            password,
            city: "",
            state: "",
          });

          const nProfile = {
            userID: user._id,
            fullName,
            userName,
            avatar,
            actions: [],
          };

          Profile.create(nProfile, (err, profile) => {
            if (err) return express_helper.handle_error(err, res);
            user.generateAuthToken().then(
              (token) => {
                res.status(201).send({ result: 0, user, token, profile });
              },
              (err) => {
                express_helper.handle_error(err, res);
              }
            );
          });
        } catch (e) {}
      }
    });
  },

  logout: function (req, res) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    req.user.save().then(
      () => {
        res.send();
      },
      (err) => {
        express_helper.handle_error(err);
      }
    );
  },

  userInfo: (req, res) => {
    const { userID } = req.body;
    private._wrapCon(res, async () => {
      const user = await User.findById(userID, "email");
      const { email, fullName, userName } = user;

      res.status(200).send({ email, fullName, userName });
    });
  },
};

module.exports = auth;
