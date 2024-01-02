const router = require("express").Router();

const authRoute = require("./authRoute");
const userRoute = require("./userRoute");

router.use("/auth", authRoute);
router.use("/user", userRoute);

router.get("/getDetails",(req,res)=>{
    return res.status(200).json({
        success: true,
        message: "Connected..."
    });
})

module.exports = router;