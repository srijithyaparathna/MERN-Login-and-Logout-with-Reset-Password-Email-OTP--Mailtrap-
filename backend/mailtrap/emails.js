import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";
// Function to send a verification email
export const sendVerificationEmail = async (email, verificationToken) => {
    // Define the recipient as an array with the email object
    const recipient = [{ email }];

    try {
        // Attempt to send the verification email using the mailtrap client
        const response = await client.send({
            from: sender, // Sender's email address (configured elsewhere)
            to: recipient, // Recipient's email address
            subject: "Verify your email", // Email subject
            // Use a template with a placeholder for the verification token
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification", // Category of the email for organization
        });

        // Log success response to the console
        console.log("Email sent successfully", response);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(`Error sending verification`, error);

        // Throw a new error to propagate it to the calling function
        throw new Error(`Error sending verification email: ${error}`);
    }
};

// Function to send a welcome email
export const sendWelcomeEmail = async (email, name) => {
    // Define the recipient as an array with the email object
    const recipient = [{ email }];

    try {
        // Attempt to send the welcome email using the mailtrap client
        const response = await client.send({
            from: sender, // Sender's email address
            to: recipient, // Recipient's email address
            template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df", // UUID of the welcome email template
            template_variables: {
                company_info_name: "Auth Company", // Company name to display in the email
                name: name, // Recipient's name for personalization
            },
        });

        // Log success response to the console
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(`Error sending welcome email`, error);

        // Throw a new error to propagate it to the calling function
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
    // Define the recipient as an array with the email object
    const recipient = [{ email }];

    try {
        // Attempt to send the password reset email using the mailtrap client
        const response = await client.send({
            from: sender, // Sender's email address
            to: recipient, // Recipient's email address
            subject: "Reset your password", // Email subject
            // Use a template with a placeholder for the reset URL
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset", // Category of the email for organization
        });

        // Log success response to the console
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(`Error sending password reset email`, error);

        // Throw a new error to propagate it to the calling function
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

// Function to send an email confirming successful password reset
export const sendResetSuccessEmail = async (email) => {
    // Define the recipient as an array with the email object
    const recipient = [{ email }];

    try {
        // Attempt to send the password reset success email using the mailtrap client
        const response = await client.send({
            from: sender, // Sender's email address
            to: recipient, // Recipient's email address
            subject: "Password Reset Successful", // Email subject
            html: PASSWORD_RESET_SUCCESS_TEMPLATE, // Predefined template for success message
            category: "Password Reset", // Category of the email for organization
        });

        // Log success response to the console
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(`Error sending password reset success email`, error);

        // Throw a new error to propagate it to the calling function
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};
