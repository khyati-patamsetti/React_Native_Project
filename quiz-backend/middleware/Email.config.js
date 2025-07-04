import nodemailer from 'nodemailer'

 export const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"kathisrujanasri1524@gmail.com",
        pass:"rtvh rkpr gtgs mzzx",
    },
});




