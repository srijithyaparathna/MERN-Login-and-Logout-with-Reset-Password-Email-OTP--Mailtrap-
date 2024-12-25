import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Corrected from bcrypt.js.hash to bcrypt.hash
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword, // Corrected the variable name from hashedpassword to hashedPassword
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify a user's email by checking a verification code (code) sent to them. If valid, the user’s account is marked as verified.

export const verifyEmail = async (req, res) => {
  // Extracts the code (verification token) submitted by the user via an API request.
  const { code } = req.body;

  try {
    //Find the user matching provided verification code and check the Expire date
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    // handle the invalid or expired code:
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verification" });
    }

    // make the user verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    //send a welcome email to the user
    await sendWelcomeEmail(user.email, user.name);

    // respond to the client
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verify Email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Handles user login by validating email and password, generating a token, and responding with user data while excluding sensitive information.

export const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid login" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate a token and set it as a cookie
    const token = generateTokenAndSetCookie(res, user._id);

    // Update the user last login
    user.lastLogin = new Date();
    await user.save();

    // Send a success response with the user data excluding the password and the token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,  // Do not send the password back
        token,  // Optionally, you can send the token back if you want to use it on the client-side immediately
      },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  // Extract the email from the request body
  const { email } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate a Reset Token and Expiry Time:
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Update the user object
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send the reset email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    // Send a success response
    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Extract reset token from the route parameters and new password from the request body
    const { token } = req.params;
    const { password } = req.body;

    // Find the user with the given reset token and ensure the token has not expired
    const user = await User.findOne({
      resetPasswordToken: token, // Match the token
      resetPasswordExpiresAt: { $gt: Date.now() }, // Ensure the token is still valid
    });

    // If no user is found, respond with an error
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Corrected bcryptjs.hash to bcrypt.hash

    // Update the user's password and remove the reset token and its expiry date
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpiresAt = undefined; // Clear the expiry time
    await user.save(); // Save the changes to the database

    // Optionally, send an email confirming the password reset
    await sendResetSuccessEmail(user.email);

    // Respond with a success message
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
export const checkAuth = async (req, res) => {
  try {
    // Find the user by their ID (provided in `req.userId` from the verification middleware)
    const user = await User.findById(req.userId).select("-password");

    // If no user is found, return a 400 response with an error message
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Respond with the user's data, indicating successful authentication
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};