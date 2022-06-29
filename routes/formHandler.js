const express = require("express");
const app = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
  },

  secure: true,
  tls: { rejectUnauthorized: false },
  //only for cheap servers like host presto with no authentication
});

function returnContactForm(name, org, phone, email, message) {
  const mailOptions = {
    from: "portfolioformhandler@pitans.co.uk",
    to: "jonpitans@gmail.com",
    subject: "Form Response",
    text: `       Name: ${name}
        Organisation: ${org}
        Phone: ${phone}
        Email: ${email}
        Message: ${message}`,
  };
  transporter.sendMail(mailOptions, (error, response) =>
    console.log(error, response)
  );
}

app.post("/", async (req, res) => {
  await returnContactForm(
    req.body.name,
    req.body.org,
    req.body.phone,
    req.body.email,
    req.body.message
  );
  res.send("success");
});

module.exports = app;
