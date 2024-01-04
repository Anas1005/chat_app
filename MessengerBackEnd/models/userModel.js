const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defining a Mongoose Schema.......
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  // avatar:
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      message: (props) => `Email (${props.value}) is invalid!`,
    },
  },

  avatar: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  passwordChangedAt: {
    // unselect
    type: Date,
  },
  passwordResetToken: {
    // unselect
    type: String,
  },
  passwordResetExpires: {
    // unselect
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    // unselect
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Online", "Offline"],
  },
  socket_id: {
    type: String,
  },

  // additionalDetails:{
  //      type:mongoose.Schema.Types.ObjectId,
  //      ref:"Profile"
  // },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // notifications: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Notification",
  //   },
  // ],
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.password) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //! Shift it to next hook // this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

//  Creating a Mongoose Model.....
module.exports = mongoose.model("User", userSchema);
