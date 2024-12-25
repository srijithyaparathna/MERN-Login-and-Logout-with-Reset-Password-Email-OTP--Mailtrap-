/* 
Key Features:
1. State Management
    The useState hook is used to manage to email and password inputs locally     
    these states are updated usint he onChange event handler

2. Authentication with Zustand
    the useAuthStore provides 
        login function to authenticate the user
        isLoading Boolean to show loading spinner
        error to show error message
3. Reusable Components
    The Input and Button components are reusable and can be used in other pages
4. Routing
    Link is used for navigation to the "Forgot Password" and "sign Up" pages without reloading the page
5. Animations
    motion.div form Framer Motion adds smooth animations for the page entry
    The whileHoveer and whileTap props are used to add animations to the button
6. Error Handling
    The error variable is conditionally rendered to show error messages
7. Responsive UI 
    The design uses Tailwind css for responsive modern layout with features like 
        Gradients
        shadows
        Rounded corners
8. Loading State
    if isLoading is true a spinner is shown using the Loader incon otherwise the "Login" button text is displayed
9. Password Recovery
    includes a link to the "Forgot Password" page for password recovery
*/
import { useState } from "react"; // React hook for managing local state
import { motion } from "framer-motion"; // For animations
import { Mail, Lock, Loader } from "lucide-react"; // Icons from Lucide
import { Link } from "react-router-dom"; // For client-side routing
import Input from "../components/Input"; // Custom reusable input component
import { useAuthStore } from "../store/authStore"; // Zustand-based state management store for authentication

// Main LoginPage component
const LoginPage = () => {
	// Local state for managing form inputs
	const [email, setEmail] = useState(""); // Stores the user's email
	const [password, setPassword] = useState(""); // Stores the user's password

	// Destructure functions and variables from the Zustand auth store
	const { login, isLoading, error } = useAuthStore();

	// Form submission handler
	const handleLogin = async (e) => {
		e.preventDefault(); // Prevent page reload on form submission
		await login(email, password); // Call the login function from the auth store
	};

	return (
		<motion.div
			// Framer Motion animations for smooth entry
			initial={{ opacity: 0, y: 20 }} // Initial animation state
			animate={{ opacity: 1, y: 0 }} // Final animation state
			transition={{ duration: 0.5 }} // Duration of animation
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				{/* Page heading */}
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Welcome Back
				</h2>

				{/* Form container */}
				<form onSubmit={handleLogin}>
					{/* Email Input */}
					<Input
						icon={Mail} // Icon for the input field
						type='email' // Input type
						placeholder='Email Address' // Placeholder text
						value={email} // Bound to the `email` state
						onChange={(e) => setEmail(e.target.value)} // Updates state on user input
					/>

					{/* Password Input */}
					<Input
						icon={Lock} // Icon for the input field
						type='password' // Input type
						placeholder='Password' // Placeholder text
						value={password} // Bound to the `password` state
						onChange={(e) => setPassword(e.target.value)} // Updates state on user input
					/>

					{/* Forgot Password Link */}
					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
							Forgot password?
						</Link>
					</div>

					{/* Error message */}
					 {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>} 

					{/* Submit Button */}
					<motion.button
						whileHover={{ scale: 1.02 }} // Scale animation on hover
						whileTap={{ scale: 0.98 }} // Scale animation on tap/click
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
					//	disabled={isLoading} // Disable the button when loading
					>
						{/* Show loading spinner or button text */}
						 {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"} 
					</motion.button>
				</form>
			</div>

			{/* Signup Link */}
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-green-400 hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default LoginPage; // Export the LoginPage component
