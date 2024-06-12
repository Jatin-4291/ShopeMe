import User from "../Models/userModels.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import { LocalStorage } from "node-localstorage";
import AppError from "../utils/AppError.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
const localStorage = new LocalStorage("./scratch");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CODE, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  localStorage.setItem("jwt", token);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signUp = catchAsync(async (req, res, next) => {
  if (req.body.roles === "admin") {
    return next(new AppError("you cannot login as admin", 400));
  }
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});
export const login = catchAsync(async (req, res, next) => {
  const { email, mobileNumber, password } = req.body;
  if (!(email || mobileNumber) || !password) {
    return next(new AppError("please provide your email and password", 404));
  }
  const user = email
    ? await User.findOne({ email }).select("+password")
    : await User.findOne({ mobileNumber }).select("+password");
  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError("The e-mail does not exists or password does not match", 401)
    );
  }
  createSendToken(user, 200, res);
});
export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = localStorage.getItem("jwt");
  }
  if (!token) {
    return next(
      new AppError("You are not  logged in please login to get token!! ", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_CODE);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        `the user belonging to this token does not exist anymore`,
        401
      )
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  req.user = freshUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError("you do not have permission to perfoem this", 403)
      );
    }
    next();
  };
};
export const forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email;
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return next(new AppError(`there is no user with an email address`, 404));
  }
  // generate the random token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  // send it back as an emial
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}}`;
  const message = `Forgot your Password?submit a patchh request with your new password and password confirm to :${resetURL}.\n if tou didint foeget you password please ignore this email`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: `your password reset token  (it s valid for 10 min)`,
      message,
    });
    res.status(200).json({
      status: `success`,
      message: `Token sent to Email`,
    });
  } catch (err) {
    console.log(err);
    (user.createPasswordResetToken = undefined),
      (user.createPasswordResetExpires = undefined),
      await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `there was an error sending the email!! try again later`,
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // console.log(user);
  if (!user) {
    return next(new AppError("the token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 201, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByID(req.user.id).select("+password");

  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError(`the passoword is not correct`, 400));
  }
  user.password = req.body.updatedPassword;
  user.passwordConfirm = req.body.updatedPasswordConfirm;

  await user.save();

  createSendToken(user, 201, res);
});
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Please login again", 404));
  res.status(200).json({
    status: "success",
    user,
  });
});

export const logout = (req, res, next) => {
  localStorage.removeItem("jwt");
  res.status(200).json({
    status: "success",
  });
};
