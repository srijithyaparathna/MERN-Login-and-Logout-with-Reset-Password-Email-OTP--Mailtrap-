// Importing required modules and dependencies
import express from 'express'; // Express framework for creating the server
import cookieParser from 'cookie-parser'; // Middleware to parse cookies in incoming requests
import { connectDB } from './config/db.js'; // Function to establish a database connection
import cors from "cors"; // Middleware to handle Cross-Origin Resource Sharing
import authRoutes from './routes/auth.route.js'; // Routes for authentication-related API endpoints

const app = express(); // Initialize an Express application
const PORT = process.env.PORT || 6000; // Define the port to run the server, defaulting to 6000 if not set in environment variables

// Connect to the database
connectDB(); // Call the function to connect to the database (e.g., MongoDB, MySQL)

// Middleware to parse incoming JSON requests
app.use(express.json()); // Parses incoming JSON payloads and makes them available in `req.body`
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads (form submissions)

// CORS setup
app.use(cors({ 
    origin: "http://localhost:5173", // Allow requests from this frontend origin
    credentials: true // Allow cookies and credentials to be sent across domains
}));

// Middleware to parse cookies in incoming requests
app.use(cookieParser()); // Makes cookies available in `req.cookies`

// Basic test route
app.get("/", (req, res) => { // Define a route for the root URL
    res.send("Hello world 123"); // Send a simple response for testing
});

// Authentication routes
app.use("/api/auth", authRoutes); // Mount authentication routes under the `/api/auth` path

// Start the server
app.listen(PORT, () => { // Start listening for incoming requests on the specified port
    console.log(`Server is running on port ${PORT}`); // Log a message indicating the server has started
});
