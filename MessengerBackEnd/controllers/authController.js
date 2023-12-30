const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const filterObj = require("../utils/filterObj");
const { validationResult } = require('express-validator');
const mailSender = require("../services/mailSender");
const otpGenerator = require("otp-generator");
const resetPasswordBody = require("../Templates/Mail/resetPasswordBody");
require("dotenv").config();

exports.register = async (req, res, next) => {
  console.log("In SignUp");
  try {
    const { firstName, lastName, email, password,confirmPassword } = req.body;
    if(!firstName||!lastName||!password||!confirmPassword){
        console.log("Missing Hia Kuchh..")
        return res.status(400).json({
            success: false,
            message: "Please fill all the details carefully..."
        });
    }

    if(password!==confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password and Confirm Password do not match.."
        });
    }


    const filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "email",
      "password"
    );

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      // User with this email already exists and is verified, ask them to login
      return res.status(400).json({
        status: "error",
        success: false,
        message: "Email already in use, please login.",
      });
    } else if (existingUser) {
      // If not verified, update the existing user and send a new OTP
      // let hashedPassword = await hashPassword(password);
      // filteredBody = { ...filteredBody, password: hashedPassword };

      const user=await User.findOneAndUpdate({ email: email }, filteredBody, {
        new: true,
        validateModifiedOnly: true,
      });

      await user.save();

      // Generate an OTP and send it to the email
      req.user = {
        userId: existingUser._id,
        email: existingUser.email,
      };

      next();
    } else {
      // If user is not created before, create a new one
      // let hashedPassword = await hashPassword(password);
      // filteredBody = { ...filteredBody, password: hashedPassword };

      const newUser = await User.create(filteredBody);

      // Generate an OTP and send it to the email
      req.user = {
        userId: newUser._id,
        email: newUser.email,
      };
      next();
    }
  } catch (error) {
    console.error("Error in register middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating user",
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    console.log("Sending OTP...");

    const userEmail = req.user.email;

    // Generate a 6-digit OTP
    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", generatedOTP);

    //   // Check if the generated OTP is unique
    //   let hashedOTP=bcrypt.hash(generatedOTP, 12);

    //   let existingOTP = await OTP.findOne({ otp: hashedOTP });

    //   while (existingOTP) {
    //     // Regenerate OTP until it's unique
    //     generatedOTP = otpGenerator.generate(6, {
    //       upperCaseAlphabets: false,
    //       lowerCaseAlphabets: false,
    //       specialChars: false,
    //     });
    //     hashedOTP=bcrypt.hash(generatedOTP, 12);
    //     existingOTP = await OTP.findOne({ otp: hashedOTP });
    //   }

    console.log("Unique OTP Generated:", generatedOTP);

    // Save the unique OTP to the database
    const otp_expiry_time = Date.now() + 10 * 60 * 1000;
    const createdOTP = await OTP.create({
      email: userEmail,
      otp: generatedOTP,
      otp_expiry_time,
    });

    console.log("OTP Saved to Database:", createdOTP);

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.error("Error in sendOTP middleware:", error);

    return res.status(500).json({
      success: false,
      message: "Error in sending OTP",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Verifying OTP for:", email);

    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Validation failed.',
    //       errors: errors.array(),
    //     });
    //   }

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "OTP Not Found",
      });
    }

    const recentOTP = await OTP.findOne({
      email,
      otp_expiry_time: { $gt: Date.now() },
    }).sort({ createdAt: -1 });

    console.log("Latest OTP from DB:", recentOTP);

    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    console.log("Type of Client OTP:", typeof otp);
    console.log("Type of DB OTP:", typeof recentOTP.otp);

    const isOTPMatched = await bcrypt.compare(otp, recentOTP.otp);

    if (isOTPMatched) {
      const user = await User.findOneAndUpdate(
        { email },
        { verified: true },
        { new: true }
      );
      await OTP.deleteMany({ email });
      const payload = {
        userId: user._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      const responseUser = {
        ...user.toObject(),
        token: token,
        password: undefined,
      };

      const options = {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options);

      return res.status(200).json({
        success: true,
        responseUser,
        token,
        message: "OTP Verified & Logged in successfully",
      });
    } else {
      console.log("OTP Mismatch:", otp, recentOTP.otp);
      return res.status(400).json({
        success: false,
        message: "OTP does not match.",
      });
    }
  } catch (e) {
    console.error("Error in verifyOTP middleware:", e.message);

    return res.status(500).json({
      success: false,
      message: "Error verifying OTP.",
    });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the details carefully...",
      });
    }

    const user = await User.findOne({ email });

    if (!user ||!user.verified) {
      return res.status(401).json({
        success: false,
        message: "First, go and sign up, then log in.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        const payload = {
            userId: user._id,
          };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      const responseUser = {
        ...user.toObject(),
        token: token,
        password: undefined,
      };

      const options = {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options);

      return res.status(200).json({
        success: true,
        responseUser,
        token,
        message: "Logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.error("Error in logIn middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Log In",
    });
  }
};

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate request parameters
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //       success: false,
    //       errors: errors.array(),
    //       message: 'Please fill your email correctly.',
    //     });
    //   }
  
      // Check if the user exists with the provided email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Your email is not registered with us.',
        });
      }
  
      // Generate password reset token and URL
      const {resetToken, passwordResetToken, passwordResetExpires } = createPasswordResetToken();
      const encodedToken = encodeURIComponent(resetToken);
      const resetURL = `https://localhost:3000/auth/new-password?passwordToken=${encodedToken}`;
  
      // Update user with the new password reset token and expiry time
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { passwordResetToken, passwordResetExpires },
        { new: true }
      );
  
      // Compose the email content
      const htmlContent = resetPasswordBody(user.firstName, resetURL);
  
      // Send the password reset email
      await mailSender(email, 'Reset Password Link | Messenger', htmlContent);
  
      // Return success response
      return res.status(200).json({
        success: true,
        expiryTime: updatedUser.passwordResetExpires,
        message: 'Reset link sent successfully.',
      });
    } catch (e) {
      console.error(e);
  
      // Handle errors and clean up password reset data
      if (updatedUser) {
        updatedUser.passwordResetToken = undefined;
        updatedUser.passwordResetExpires = undefined;
        await updatedUser.save({ validateBeforeSave: false });
      }
  
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while sending the reset link.',
      });
    }
};

exports.resetPassword = async (req, res) => {
    try {
      const { newPassword, confirmNewPassword, passwordToken } = req.body;

      if(!newPassword || !confirmNewPassword || !passwordToken){
        return res.status(400).json({
            success: false,
            message: 'Incomplete Body.',
          });

      }
  
      // Validate request parameters
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //       success: false,
    //       errors: errors.array(),
    //       message: 'Please fill the fields correctly.',
    //     });
    //   }
  
      // Hash the provided password token for comparison
      const hashedToken = crypto.createHash('sha256').update(passwordToken).digest('hex');
      console.log("HashedPasswordToken",hashedToken)
  
      // Find user with the hashed token and a valid expiry time
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    
      // Handle invalid or expired token
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token is invalid or expired.',
        });
      }
  
      // Check if new password and confirmation match
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match.',
        });
      }
  
      // Update user with the new password and clear reset token data
      const updatedUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { password: newPassword, passwordResetToken: null, passwordResetExpires: null, passwordChangedAt:Date.now() },
        { new: true }
      );
  
      await updatedUser.save();
      // Generate a new JWT token for the user
      const payload = {
        userId: updatedUser._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h',
      });
  
      // Prepare the user response
      const responseUser = {
        ...updatedUser.toObject(),
        token: token,
        password: undefined,
      };
  
      // Set the new token in a cookie
      const options = {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie('token', token, options);
  
      // Return success response
      return res.json({
        success: true,
        responseUser,
        token,
        message: 'Password has been successfully updated and user logged in.',
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while resetting the password.',
      });
    }
};














const createPasswordResetToken = ()=> {
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    const passwordResetExpires = Date.now() + 20 * 60 * 1000;
  
    return {resetToken,passwordResetToken, passwordResetExpires};
  };







 