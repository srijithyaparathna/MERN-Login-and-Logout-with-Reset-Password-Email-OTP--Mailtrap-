# Authentication and Dashboard App

This project is a React-based application for user authentication, password management, and a dashboard interface. The app includes features like user signup, login, email verification, password reset, and access to a protected dashboard for authenticated users.

## Features
![image](https://github.com/user-attachments/assets/1b5b5ea2-68fd-411a-a654-f1d353be9927)

- **User Authentication**: Secure login and signup functionality with protected routes.
- **Email Verification**: Users must verify their email before accessing the dashboard.
- **Password Management**: Forgot password and password reset functionality.
- **Dashboard Access**: Only accessible to authenticated and verified users.
- **Redirects**:
  - Redirects authenticated users to the dashboard when trying to access login or signup pages.
  - Redirects unauthenticated users to the login page when trying to access protected routes.
- **Responsive UI**: Includes floating shapes and a gradient background for a modern, aesthetic design.
- **Toast Notifications**: Displays notifications for user actions.
![image](https://github.com/user-attachments/assets/b17e671c-d83f-4399-8090-d8ceb5ab63fd)

## Tech Stack

- **Frontend**: React, React Router
- **State Management**: Custom authentication store (e.g., Zustand, Context API)
- **Styling**: Tailwind CSS
- **Notifications**: `react-hot-toast`
![image](https://github.com/user-attachments/assets/30161e64-7195-4489-9411-c447e3875c51)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/authentication-dashboard-app.git

Navigate to the project directory and install dependencies:

bash
Copy code
cd authentication-dashboard-app
npm install
Start the development server:
![image](https://github.com/user-attachments/assets/7d45bc1e-57f9-4a40-a90e-2f4c378b5799)

bash
Copy code
npm start
Open your browser and visit http://localhost:3000.
![image](https://github.com/user-attachments/assets/9c3988c0-d325-4741-99f5-022a67aa6565)

Folder Structure
bash
Copy code
src/
├── components/       # Reusable components (e.g., FloatingShape, LoadingSpinner)
├── pages/            # Application pages (e.g., LoginPage, DashboardPage)
├── store/            # State management (e.g., authStore.js)
├── App.js            # Main application component with routing
├── index.js          # Entry point for the React application
Usage
![image](https://github.com/user-attachments/assets/63de8e2c-fd4f-40a3-97ba-f209a0e3f24e)

Authentication Flow
Signup: New users can sign up at /signup.
Login: Users log in at /login.
Email Verification: Users are redirected to /verify-email if their email is not verified.
Dashboard: Authenticated and verified users can access the dashboard at /dashboard.
Password Reset:
Forgot Password: Users can reset their password by visiting /forgot-password.
Reset Password: After receiving a token, users can reset their password at /reset-password/:token.
Protected Routes
Access to /dashboard is restricted to authenticated and verified users.
Redirects unauthenticated users to /login.
Customization
Modify floating shapes in the FloatingShape component for a unique design.
Update state management logic in authStore.js for additional features like roles or permissions.
Future Enhancements
Add role-based access control for admin and user-specific views.
Implement persistent login using tokens or cookies.
Enhance UI/UX with additional animations and design elements.
Contributing
Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Make your changes and commit them:
bash
Copy code
git commit -m "Add feature name"
Push to your branch:
bash
Copy code
git push origin feature-name
Open a pull request.
License
This project is licensed under the MIT License.

Acknowledgments
React
React Router
Tailwind CSS
react-hot-toast
sql
Copy code
