
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isValidToken = async (req, res, next) => {
    try {
      console.log("Checking Token Validity...");
      const token = req.header('Authorization')?.replace('Bearer ', '');
  
      if (!token) {
        console.log("Token Missing...");
        return res.status(401).json({
          success: false,
          message: "You are not logged in! Please log in to get access.",
        });
      }
  
      try {
        console.log("Verifying Token...");
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const this_user = await User.findById({ _id: payload.userId });

        if (!this_user) {
            return res.status(401).json({
              message: "The user belonging to this token does no longer exists.",
            });
          }
  
        if (wasPasswordChanged(this_user.passwordChangedAt, payload.iat)) {
          return res.status(401).json({
            message: "User recently changed the password! Please log in again.",
          });
        }
  
        req.user = this_user;
        console.log("Token Validated.");
        next();
  
      } catch (e) {
        console.error('Error in isValidToken middleware:', e.message);
        return res.status(401).json({
          success: false,
          message: 'Token is Invalid',
        });
      }
    } catch (e) {
      console.error('Error in isValidToken middleware:', e.message);
      return res.status(500).json({
        success: false,
        message: 'Could not Validate Token.',
      });
    }
  };



  // Middleware to renew the token if close to expiration
exports.renewToken = async (req, res, next) => {
    try {
      console.log("Checking Token Expiration...");
      const expirationThreshold = 600; // 10 minutes in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const payload = req.user;
  
      if (payload.exp - currentTime < expirationThreshold) {
        console.log("Renewing Token...");
        const renewPayload = {
          userId: payload.userId,
        };
  
        // Generate a new token with extended expiration
        let newToken = jwt.sign(renewPayload, process.env.JWT_SECRET, { expiresIn: '8h' });
  
        // Set headers and cookies for the renewed token
        res.setHeader('X-Token-Renewed', 'true');
        res.cookie('token', newToken, { httpOnly: true, expires: new Date(Date.now() + 8 * 60 * 60 * 1000) });
      } else {
        console.log("No Renewal Required.");
      }
  
      // Continue to the next middleware
      next();
    } catch (e) {
      console.error('Error in renewToken middleware:', e.message);
      return res.status(500).json({
        success: false,
        message: 'Error renewing Token.',
      });
    }
  };
  
  



  const wasPasswordChanged = (passwordChangedAt,JWTTimeStamp)=> {
    if (passwordChangedAt) {
      const changedTimeStamp = parseInt(
        passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimeStamp < changedTimeStamp;
    }
  
    // FALSE MEANS NOT CHANGED
    return false;
  };