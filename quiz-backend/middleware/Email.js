
import { transporter } from './Email.config.js';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const readHTMLFile = (filepath) => {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (err) {
    console.error('Error reading template:', err);
    return '';
  }
};

export const SendVerficationCode = async (email, verficationCode) => {
  try {
    const filePath = path.join(__dirname, 'templates', 'email-verification.hbs');
    const source = readHTMLFile(filePath);
    const template = handlebars.compile(source);

    
    
    const htmlToSend = template({
      email,
      verficationCode,
    });

    const info = await transporter.sendMail({
      from: '"DoubtApp" kathisrujanasri1524@gmail.com',
      to: email,
      subject: ' OTP(One Time Password) - DoubtApp',
      html: htmlToSend,
    });

    console.log(' Email sent successfully:', info.messageId);
  } catch (error) {
    console.error(' Failed to send OTP email:', error);
  }
};







