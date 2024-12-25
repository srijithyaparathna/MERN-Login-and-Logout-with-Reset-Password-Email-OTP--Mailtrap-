import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Hardcode the JWT secret key here
  const JWT_SECRET = "testnew"; // Replace with your actual secret key
  
  // Log the token from cookies and headers for debugging
  console.log('Token from cookies:', req.cookies.token);
  console.log('Token from headers:', req.headers.authorization);

  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    // Verify the token using the hardcoded secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add the `userId` from the token's payload to the request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("Error in verifyToken: ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
