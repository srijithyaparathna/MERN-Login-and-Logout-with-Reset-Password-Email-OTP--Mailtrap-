/* 

Key Features:
1.State Management:

Manages password and confirmPassword using React's useState.
Uses a custom useAuthStore hook (likely Zustand or similar) for authentication logic and global state.

2.Form Validation:

Ensures that the password and confirmation fields match before submitting.

3.Routing:

Uses useParams to extract a token from the URL for identifying the user resetting their password.
Uses useNavigate for redirecting the user after a successful operation.

4.Animations:

Utilizes framer-motion for smooth entry animations of the form and hover/tap effects on the button.

5.Error Handling:

Displays error and success messages to provide user feedback.
Shows toast notifications using react-hot-toast for better UX.

6.Custom Components:

Reuses a styled Input component with icons for a consistent UI.

7.UI Design:

Modern and responsive design with gradient backgrounds, rounded corners, and shadow effects.

8.Loading State:

Disables the button and changes its text to indicate an ongoing operation (isLoading).

*/




import { useState } from "react"; // Import React hook to manage local state.
import { motion } from "framer-motion"; // Import framer-motion for animations.
import { useAuthStore } from "../store/authStore"; // Import a custom store (likely Zustand) for authentication-related state and actions.
import { useNavigate, useParams } from "react-router-dom"; // Import hooks for navigation and parameter handling in React Router.
import Input from "../components/Input"; // Import a custom input component for reusable styled input fields.
import { Lock } from "lucide-react"; // Import a lock icon from the Lucide icon library.
import toast from "react-hot-toast"; // Import toast notifications for user feedback.

const ResetPasswordPage = () => {
    // State to manage the input fields for password and confirmation.
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Destructuring actions and state from the custom authentication store.
	const { resetPassword, error, isLoading, message } = useAuthStore();

	// Extract the token from the route parameters.
	const { token } = useParams();

	// Hook for programmatic navigation.
	const navigate = useNavigate();

	// Handles form submission for resetting the password.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent the default form submission behavior.

		// Check if the passwords match before proceeding.
		if (password !== confirmPassword) {
			alert("Passwords do not match"); // Show an alert if passwords don't match.
			return; // Exit the function to avoid further execution.
		}

		try {
			// Attempt to reset the password using the token and new password.
			await resetPassword(token, password);

			// Notify the user of a successful password reset.
			toast.success("Password reset successfully, redirecting to login page...");

			// Redirect the user to the login page after a delay.
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			// Log the error and show an error notification.
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }} // Animation: Start with slight transparency and offset.
			animate={{ opacity: 1, y: 0 }} // Animation: Fade in and slide into place.
			transition={{ duration: 0.5 }} // Duration of the animation.
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				{/* Title section with gradient text styling */}
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Reset Password
				</h2>
				
				{/* Error or success message display */}
				 {error && <p className='text-red-500 text-sm mb-4'>{error}</p>} 
				 {message && <p className='text-green-500 text-sm mb-4'>{message}</p>} 

				<form onSubmit={handleSubmit}>
					{/* Input field for the new password */}
					<Input
						icon={Lock} // Lock icon next to the input.
						type='password' // Password input type for hidden characters.
						placeholder='New Password'
						value={password} // Bind the state to the input value.
						onChange={(e) => setPassword(e.target.value)} // Update state on input change.
						required // Mark the input as required.
					/>

					{/* Input field for confirming the new password */}
					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm New Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					{/* Submit button with animations and conditional text */}
					<motion.button
						whileHover={{ scale: 1.02 }} // Slightly enlarge on hover.
						whileTap={{ scale: 0.98 }} // Slightly shrink on click.
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading} // Disable the button while loading.
					>
						 {isLoading ? "Resetting..." : "Set New Password"} 
					</motion.button>
				</form>
			</div>
		</motion.div>
	);
};

export default ResetPasswordPage;
