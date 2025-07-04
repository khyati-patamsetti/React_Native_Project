
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve(); 


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: 'kathisrujanasri1524@gmail.com',
    pass: 'rtvh rkpr gtgs mzzx', 
  },
});


const readHTMLFile = (filepath) => {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (err) {
    console.error(' Error reading template:', err);
    return '';
  }
};


export const sendEmail = async (username, email, verficationCode) => {
  console.log("Calling sendEmail with:", { username, email, verficationCode });

  try {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid or missing recipient email address');
    }

    const filePath = path.join(__dirname, 'templates', 'email-signup.hbs');
    const source = readHTMLFile(filePath);
    const template = handlebars.compile(source);

    const htmlToSend = template({
      username,
      email,
      verficationCode,
    });

    const info = await transporter.sendMail({
      from: '"DoubtApp" <kathisrujanasri1524@gmail.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlToSend,
    });

    console.log(' Verification email sent:', info.messageId);
  } catch (error) {
    console.error(' Failed to send verification email:', error);
  }
};
