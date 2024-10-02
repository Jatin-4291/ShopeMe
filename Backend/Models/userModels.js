import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    type: {
      hNo: {
        type: String,
        required: [true, "A user must have a house number"],
      },
      street: {
        type: String,
        required: [true, "A user must have a street"],
      },
      area: {
        type: String,
        required: [true, "A user must have an area"],
      },
      district: {
        type: String,
        required: [true, "A user must have a district"],
      },
      state: {
        type: String,
        required: [true, "A user must have a state"],
      },
      country: {
        type: String,
        required: [true, "A user must have a country"],
      },
      landmark: {
        type: String,
      },
    },
    required: false,
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
  gstNumber: {
    type: String,
    length: 16,
    unique: true,
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
  passwordResetExpires: Date,
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
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
