import jwt from "jsonwebtoken";

// Function to generate JWT token and set it as an HTTP only cookie in the response 
export const generateTokenAndSetCookie = (res, userId) => {
  // Generate a JWT token using the user ID as the payload and a secret key from environment variables.
  const token = jwt.sign(
    { userId }, // The payload, containing the user ID.
    process.env.JWT_SECRET, // The secret key to sign the token, stored securely in environment variables.
    {
      expiresIn: "7d", // The token will expire in 7 days.
    }
  );

  // Set the token as a cookie in the response object.
  res.cookie("token", token, {
    httpOnly: true, // Makes the cookie accessible only via HTTP(S), not JavaScript, enhancing security.
    secure: process.env.NODE_ENV === "production", // Sets the cookie to be sent over HTTPS only if in production mode.
    sameSite: "strict", // Prevents the cookie from being sent with cross-site requests, mitigating CSRF attacks.
    maxAge: 7 * 24 * 60 * 60 * 1000, // The lifetime of the cookie in milliseconds (7 days).
  });

  return token;  // Return the generated token in case it's needed elsewhere (e.g., for debugging).
};
