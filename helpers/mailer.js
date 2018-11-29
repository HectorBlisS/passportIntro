const nodemailer = require("nodemailer");
const hbs = require("hbs");
const fs = require("fs");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "fixtermailer@gmail.com",
    pass: "Superman77"
  }
});

const accountCreated = hbs.compile(
  fs.readFileSync((__dirname, "./views/mail.hbs"), "utf8")
);

function welcomeMail(email, name) {
  return transport
    .sendMail({
      to: email,
      subject: "Polloyon te da la bienvenida",
      from: "polloyon@pollito.com",
      html: accountCreated({ name })
    })
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
}

module.exports = { welcomeMail };
