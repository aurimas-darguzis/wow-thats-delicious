const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transport.sendMail({
  from:'Aurimas D <aurimasdarguzis@gmail.com',
  to: 'romka@example.com',
  subject: 'just trying things out',
  html: 'Hey I <strong>made it</strong>',
  text: 'Hey I **made it**'
});

