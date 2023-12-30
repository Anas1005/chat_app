const mongoose=require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const DB_URI= process.env.DB_URI.replace(
    "<PASSWORD>",
    process.env.DB_PASSWORD
  );


const dbConnect=()=>{
    mongoose.connect(DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB Connection Done......"))
    .catch((e)=>{
        console.log("Error AA Gya in DB Connection");
        process.exit(1);
    });
}

module.exports=dbConnect;