const nodemailer=require("nodemailer");
require("dotenv").config();

const mailSender=async(email,title,body)=>{
    console.log("Came for sending the Mail..."+email);
    // console.log("Came for sending the Mail..."+body);
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:465,
            secure:true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        console.log("Kkkkkklll")

        // Sending the Mail....
        let info = await transporter.sendMail({
            from:" Tawk || OTP Verification",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log("Mail Sent"+info);
        return info;
    }
    catch(e){
        console.log("Some error occured while  sending the mail...")
        console.log(e.message);
    }
}

module.exports=mailSender; 