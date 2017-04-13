let nodeMailer = require( 'nodemailer')
let random = require( 'randomstring')

import {UserModel } from './user-model'

export async function sendMail(email: String) {
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'suranaa493@gmail.com', // Your email id
            pass: 'Dash@sh1' // Your password
        }
    });

    
    let otp = random.generate({
        length : 4,
        charset : 'numeric'
    });    
    
    console.log("Test OTP", otp);

    var mailOptions = {
        from: 'suranaa493@gmail.com',
        to: email,
        subject: 'OTP - Leave App Server',
        html: otp
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            console.log("Resetting password Failed ! Retry");
        } else {
            console.log('Message sent: ' + info.response);
            console.log("Check Mail for password");
        }
    });

    UserModel.findOneAndUpdate({email : email},{otp : otp}).exec(function(err, doc){
        console.log(err, doc);
    });
    
}