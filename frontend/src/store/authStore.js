/*
The code uses  Zustand a small fast and scalable state management library to manage the authentication 
state of an application it also uses Axios to handle HTTP requsts for authentication-related operation
*/

import { create } from "zustand";
import axios from "axios";


const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
axios.defaults.withCredentials = true;

/* 
1. import.meta.env.MODE:
    detamines if the environment is development or production
    sets the API base URL on the environment

2. axios.defaults.withCredentials:
    Ensures cookies are sent with each request for handling session-based authentication

*/

// ceate the Zustand store for managing authentication state
export const useAuthStore = create((set) => ({
  // Initial state variable
  user: null, // Holds the logged-in user`s date
  isAuthenticated: false, // Indicates if the user is authenticated
  error: null, // stores error messages from API responses
  isLoading: false, // Tracks if an API request is in progress
  isCheckingAuth: true, // Tracks if authentication is being verified
  message: null, // Stores sucess or informational messages from API responses

  // Function to handle user signup
  singup: async ({email, password, name}) => {
    set({ isLoading: true, error: null }); // Start the loading state and reset errors

    try {
      // Make a POST request to the signup API endpoint
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      console.log("Signup successful:", response);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // if an error occurs, store the error message in the state
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error; // Rethrow the error for external handling
    }
  },

  //Function to handle user login
  login: async (email, password) => {
    set({ isLoading: true, error: null }); // start the loading state and reset errors

    try {
      // Make a POST request to the login API endpoint
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      // update the state with user and set the user as authentication

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      //If an error occurs, store the error message in the state
      set({
        error: error.response?.data?.message || "An unexpected error occurred.",
        isLoading: false,
      });
      
      throw error; // rethrow the error for external handling
    }
  },

  // Function to  handle user logout

  logout: async () => {
    set({ isLoading: true, error: null }); // Start the loading state and reset errors

    try {
      // Make a POST request to the logout API endpoint
      await axios.post(`${API_URL}/logout`);

      // Reset the user and authentication state
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      // If an error occurs , store the error message in the state
      set({ error: "Error logging out", isLoading: false });
      throw error; // Rethrow the error for external handling
    }
  },

  // Function to verify email using a code
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null }); // Start the loading state and reset errors
    try {
      // Make a POST request to verify the email
      const response = await axios.post(`${API_URL}/verify-email`, { code });

      // Update the state with the user data and mark as authenticated
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data; // return the response data for external use
    } catch (error) {
      // If an error occurs, store the error message in the state

      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error; // Rethrow the error for external handling
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null }); // start checkign auth and reset errors
    try {
      // Make a GET request to check authentication status
      const response = await axios.get(`${API_URL}/check-auth`);

      // update the state with user data and mark as authenticated
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      // IF an error occurs reset auth state but do not show an error
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw error; // if error comes remove this
    }
  },

  forgotpassword: async (email) => {
    set({ isLoading: true, error: null }); // Start the loading state and reset errors

    try {
      // Make a POST request a password reset
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      // update the state with the sucess message
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      // If an error occurs, store the error message in the state
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error; // Rethrow the error for external handling
    }
  },

  //Function to handle resetting the password
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null }); // Start the loading state and reset errors

    try {
      // Make a POST request to reset the password using the token
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      // Update the state with the success message
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      // If an error occurs , store the error message in the state
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error reseting password",
      });

      throw error; // Rethrow the error for external handling
    }
  },
}));
