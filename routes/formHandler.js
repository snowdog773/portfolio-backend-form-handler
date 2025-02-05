const express = require("express");
const app = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const clientEmails = require("../data/clients");
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

function returnClientContactForm(name, phone, email, message, client) {
  const sendEmail = clientEmails.find((e) => e.name === client);
  console.table(sendEmail);
  const mailOptions = {
    from: "formhandler@pitans.co.uk",
    to: sendEmail.email,
    subject: "Form Response",
    text: `       Name: ${name}
      
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

app.post("/:client", async (req, res) => {
  const client = req.params.client;
  const result = await returnClientContactForm(
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.message,
    client
  );
  res.status(200).json({ message: "success", result });
});

module.exports = app;
