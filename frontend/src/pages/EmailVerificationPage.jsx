
/*
Key Features
    1. Animations:
        The motion.div and motion.button use framer-motion for smooth animations
        button scales on hover or tap
        Form fades in from above on page load

    2. Input Fields
        six individual fields are dynamically create using code.map().
        Each field
            has a max length of 1 character
            update its corresponding value in the code arra on change 
            handles navigation between inputs using arrow keys or Backspace
    
    3. Error Handling 
        Display an error message(error) from the useAuthStore hook if verification fails

    4. Submit Button:
        Dynamically updates its lable based on isLoading
        Disables itself when inputs are empty or the verification process is ongoing

    Logic Flow
            Page Load:

            Input fields are empty by default.
            Animations display the form smoothly.
            User Interaction:

            User types or pastes the 6-digit code:
            Each character updates the corresponding input and focuses the next.
            If the code is pasted in bulk, all fields are filled sequentially.
            Automatic Submission:

            Once all six digits are filled, the form submits automatically using the handleSubmit function.
            Verification Process:

            The entered code is sent to the backend via verifyEmail.
            Success:
            Displays a success message.
            Redirects to the home page.
            Failure:
            Displays an error message.
            This code provides a smooth and user-friendly email verification experience with animations, error handling, and automatic submission.


*/
import { useEffect, useRef, useState } from "react"; // React hooks for state and refs
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { motion } from "framer-motion"; // For animations
import { useAuthStore } from "../store/authStore"; // Custom hook to manage authentication state
import toast from "react-hot-toast"; // For showing notifications

const EmailVerificationPage = () => {
	// State to hold the 6-digit verification code
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	
	// Ref array to manage focus of input fields
	const inputRefs = useRef([]);
	
	// React Router's navigation hook
	const navigate = useNavigate();
	
	// Accessing states and functions from the authentication store
	const { error, isLoading, verifyEmail } = useAuthStore();

	// Handles input changes for each digit
	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasting of the entire code
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split(""); // Extract first 6 digits
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || ""; // Assign each digit or leave empty
			}
			setCode(newCode);

			// Determine the next input to focus
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value; // Update the specific digit
			setCode(newCode);

			// Automatically focus the next input field
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	// Handles backspace key navigation
	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus(); // Focus previous input if current is empty
		}
	};

	// Handles form submission
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form behavior
		const verificationCode = code.join(""); // Combine all digits into a single string
		try {
			await verifyEmail(verificationCode); // Attempt to verify the code
			navigate("/"); // Navigate to the home page on success
			toast.success("Email verified successfully"); // Show success notification
		} catch (error) {
			console.log(error); // Log errors for debugging
		}
	};

	// Automatically submits the form when all inputs are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit")); // Submit the form programmatically
		}
	}, [code]);

	return (
		<div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }} // Starting animation state
				animate={{ opacity: 1, y: 0 }} // Final animation state
				transition={{ duration: 0.5 }} // Animation duration
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
				{/* Page title */}
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				
				{/* Instruction text */}
				<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

				{/* Form */}
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Input fields for the 6-digit code */}
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index} // Unique key for each input
								ref={(el) => (inputRefs.current[index] = el)} // Save the reference
								type='text'
								maxLength='1' // Allow only one character per input
								value={digit} // Bind value to the corresponding digit in the state
								onChange={(e) => handleChange(index, e.target.value)} // Handle value change
								onKeyDown={(e) => handleKeyDown(index, e)} // Handle key events (e.g., Backspace)
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
							/>
						))}
					</div>

					{/* Error message display */}
					 {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>} 

					{/* Submit button */}
					<motion.button
						whileHover={{ scale: 1.05 }} // Button animation on hover
						whileTap={{ scale: 0.95 }} // Button animation on tap
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)} // Disable button if loading or inputs are empty
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{/* Show "Verifying..." while loading */}
					 {isLoading ? "Verifying..." : "Verify Email"} 
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
};

export default EmailVerificationPage;
