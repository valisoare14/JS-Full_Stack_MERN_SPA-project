const nodemailer=require('nodemailer')
//nodemailer - biblioteca folosita pentru trimitere email cu ajutorul node
async function sendEmail(targetEmail,subject,text){
    try {
        await nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port:587,
            secure:false,
            auth:{
                user:process.env.OUTLOOK_EMAIL,
                pass:process.env.OUTLOOK_PASSWORD
            },
            tls:{
                ciphers:'SSLv3'
            }
        }).sendMail({
            from:process.env.OUTLOOK_EMAIL,
            to:targetEmail,
            subject:subject,
            text:text
        })
    } catch (error) {
        console.log("Couldn't send mail !")
        console.error(error)
        return error
    }

}
module.exports={sendEmail}