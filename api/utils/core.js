const { BitlyClient } = require("bitly");
const bitly = new BitlyClient(process.env.BITLY_TOKEN);
const nodemailer = require("nodemailer");

const Core = {
  sendEmail: async function (from, subject, text) {
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      // host: "smtp.gmail.com",
      // service: "gmail",
      port: 2525,
      // port: 465,
      debug: true,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    nodemailer.sendMail = true;

    const message = {
      from: from,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      text: text,
    };

    return await transport.sendMail(message);
  },
  shortenURL: async function (url) {
    let result = null;

    try {
      result = await bitly.shorten(url);
    } catch (e) {
      throw e;
    }
    return result;
  },
};

module.exports = Core;
