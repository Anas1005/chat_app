const mongoose=require("mongoose");
const otpBody = require("../Templates/Mail/otpBody");
const mailSender = require("../services/mailSender");
const bcrypt = require("bcrypt");


// Defining a Mongoose Schema.......
const otpSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        otp:{
            type:String,
            required:true
        },
        otp_expiry_time: {
            type: Date,
          },
        
        
    },
    { timestamps: true }
)

otpSchema.pre("save",async function(next){
    try{
     
        const htmlContent=otpBody(this.otp)
        this.otp=await bcrypt.hash(this.otp, 12);
        console.log("Saving OTP",this.otp)

        const mailResponse=await mailSender(this.email,"Verification Email For OTP",htmlContent);
        console.log("Mail Response:"+mailResponse);
    }
    catch(e){
        console.log("Error Occured while sending the Email...",e);
    }
    next();
})


//  Creating a Mongoose Model.....
module.exports=mongoose.model("OTP",otpSchema); 