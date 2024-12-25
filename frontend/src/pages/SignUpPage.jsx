/*
key feactures 
1 state management 
    useState manages the inputs for name,email and password
2 Form Submission
    handlesignup handles  the login for signing up a user usiing the costom authentication store(useAuthStore)
3. User Feedback
    Dispaly errors (if any) and a loader when the form is being submitted
4. Animation
    motion.div provides a fade-in and slide-up effect for the container
    the submit button has hover and tap animations for better user experience 
5. Reusability
    the input component is reusable and can be used in other forms as well
6. Styling
    the form is styled using tailwindcss classes
    the form is responsive and looks good on all screen sizes
7. Navigation 
    useNavigate hook is used to navigate to the login page after successful signup
8. Accessibility
    the form and UI elements and follow basic accessibility principles

*/

import { motion } from "framer-motion"; // Importing motion for animations.
import Input from "../components/Input"; // Custom reusable input component.
import { Loader, Lock, Mail, User } from "lucide-react"; // Icons used in the form.
import { useState } from "react"; // React hook to manage state.
import { Link, useNavigate } from "react-router-dom"; // For navigation and linking pages.
import PasswordStrengthMeter from "../components/PasswordStrengthMeter"; // Component to show password strength.
import { useAuthStore } from "../store/authStore"; // Custom authentication store.

const SignUpPage = () => {
  // State Variables to hold form data.

  const [name, setName] = useState(""); // Name of the user.
  const [email, setEmail] = useState(""); // Email of the user.
  const [password, setPassword] = useState(""); // Password of the user.
  const navigate = useNavigate(); // Navigate to other pages.

  const { singup, error, isLoading } = useAuthStore(); // Custom authentication store.

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission.

    try {
      // Call the signup function from the custom authentication store.
    await singup({ name, email, password }); // Sign up the user.

      navigate("/verify-email"); // Navigate to the login page.
    } catch (error) {
      console.log(error); // Log the error.
    }
  };

  // Main JSX structure of the sign-up page.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Initial animation state (hidden, shifted down).
      animate={{ opacity: 1, y: 0 }} // Final animation state (visible, original position).
      transition={{ duration: 0.5 }} // Animation duration in seconds.
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
        overflow-hidden"
    >
      {/* Form container */}
      <div className="p-8">
        {/* Title of the sign-up form */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        {/* Form to collect user inputs */}
        <form onSubmit={handleSignUp}>
          {/* Input field for full name */}
          <Input
            icon={User} // Icon for the input field.
            type="text" // Input type.
            placeholder="Full Name" // Placeholder text.
            value={name} // Binds input to name state.
            onChange={(e) => setName(e.target.value)} // Updates state on input change.
          />
          {/* Input field for email address */}
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Input field for password */}
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Display error message if any */}
           {error && <p className="text-red-500 font-semibold mt-2">{error}</p>} 
          {/* Password strength indicator */}
          <PasswordStrengthMeter password={password} />

          {/* Sign-up button */}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                    font-bold rounded-lg shadow-lg hover:from-green-600
                    hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }} // Animation on hover.
            whileTap={{ scale: 0.98 }} // Animation on click.
            type="submit"
            disabled={isLoading} // Disables button when loading.
          >
            {/* { Loader icon while loading, otherwise displays "Sign Up" } */}

             {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )} 
          </motion.button>
        </form>
      </div>

      {/* Footer with a link to login page */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default SignUpPage; // Export the SignUpPage component.
