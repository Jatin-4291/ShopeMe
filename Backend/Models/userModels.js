import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "A user must have an email"],
  },
  photo: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "A user must have a address"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: true,
  },
  mobileNumber: {
    type: String,
    required: [true, "A user must have a Mobile No."],
    unique: true,
    length: 10,
  },
  passwordConfirm: {
    type: String,
    required: [true, `A user must confirm password`],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: `passwords are not the same!!`,
    },
  },
  roles: {
    type: String,
    required: [true, "The role of the user must be defined"],
    default: "customer",
    enum: ["customer", "seller", "admin"],
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre("save", async function (next) {
  //check if password is modified
  if (!this.isModified("password")) return next();
  //hash password
  this.password = await bcrypt.hash(this.password, 12);
  //remove confirm pass
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  //do only if password is modified
  if (!this.isModified("password") || !this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  //subtract 1000 bcoz there could be a time diff between jwt generation and password saving
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassWord
) {
  const encryptedPas = await bcrypt.compare(candidatePassword, userPassWord);
  return encryptedPas;
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimeStamp > JWTTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
