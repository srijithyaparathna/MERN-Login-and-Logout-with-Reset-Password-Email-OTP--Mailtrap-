/* 

Key Features:

1. Animations with frame motion:
    Smooth transitions for the component appearance
    interactive button animations(hover and click effects.)

2. Form Submission:
    user inputs their email and the form is submitted to request a password reset.

3. Reusable Components:
    Input component for email and password fields.

4. State Management:
    Local state(email, isSubmitted) manages input and submission state.

5. Loading Indicator:
    A spinning loader (Loader icon) is displayed during asynchronous actions.

6. Responsive and accessible Design:
    Focus and hover states for better accessibility.
    A visually appealing and responsive layout 


How the Logic Works
Email Input Handling:

User types in the email, and the email state updates with every keystroke.
Form Submission:

On form submission (handleSubmit):
Prevents the default form behavior (e.preventDefault()).
Calls the forgotPassword method from the authentication store with the email.
Updates isSubmitted to true to show the success message.
Conditional Rendering:

Before submission, the email input form is displayed.
After submission, a success message is shown, confirming that an email (if registered) will receive the reset link.
Navigation:

A link at the bottom allows users to navigate back to the login page.
This code is a great example of combining modern UI/UX principles with React state management to create a functional and visually appealing page.



*/




import { motion } from "framer-motion"; // For adding animations to components.
import { useState } from "react"; // For managing local component state.
import { useAuthStore } from "../store/authStore"; // Custom hook to access the authentication store.
import Input from "../components/Input"; // Custom Input component for reusable input fields.
import { ArrowLeft, Loader, Mail } from "lucide-react"; // Icons for enhancing the UI.
import { Link } from "react-router-dom"; // For navigation links in a React Router-based app.

const ForgotPasswordPage = () => {

    // Local state to track the email input and submission status

    const [email , setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Extracting state and methods from the authentication store.
    const {isLoading , forgotpassword} = useAuthStore();

    // Handel form submission
    const handleSubmit = async  (e) => {
        e.preventDefault(); // prevent default form submission 
        await forgotpassword(email) // call the forgotpassword method form the auth store
        setIsSubmitted(true) // update submission status
    };

return (

    <motion.div
    // Animation for component appearance on render.
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
>
    <div className='p-8'>
        {/* Page Title */}
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Forgot Password
        </h2>

        {/* Conditional rendering based on form submission status */}
        {!isSubmitted ? (
            // Display form if not submitted
            <form onSubmit={handleSubmit}>
                <p className='text-gray-300 mb-6 text-center'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <Input
                    icon={Mail} // Icon displayed inside the input field.
                    type='email'
                    placeholder='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on change.
                    required
                />
                <motion.button
                    // Button animations for hover and click effects.
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                    type='submit'
                >
                     {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"} 
                </motion.button>
            </form>
        ) : (
            // Display success message if submitted
            <div className='text-center'>
                <motion.div
                    initial={{ scale: 0 }} // Animation to scale in the success icon.
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
                >
                    <Mail className='h-8 w-8 text-white' />
                </motion.div>
                <p className='text-gray-300 mb-6'>
                    If an account exists for {email}, you will receive a password reset link shortly.
                </p>
            </div>
        )}
    </div>

    {/* Back to Login Link */}
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
        </Link>
    </div>
</motion.div>













);

 }; 

export default ForgotPasswordPage;