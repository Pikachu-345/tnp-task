# Student Data Sharing Portal

This is a frontend application built with Next.js that facilitates controlled sharing of student data via unique, shareable links. It features an administrator panel to generate these links and a public-facing page where the shared data can be viewed and filtered. The application consumes a provided REST API for authentication and data operations.

## Features

* **Admin Authentication:** Secure login for administrators using username and password.
* **Access Token & Refresh Token Handling:** Manages JWT-based access and refresh tokens for secure API interactions and session management.
* **Shareable Link Generation:** Administrators can generate unique, cryptographically signed shareable links to specific student data.
* **Public Data Access:** Anyone with a valid shareable link can view the associated student data in a tabulated format without needing to log in.
* **Email Filtering:** The public view allows filtering student data by email address for easier navigation.
* **Responsive UI:** Designed with Tailwind CSS for a clean and responsive user experience.

## Technologies Used

* **Next.js 14 (App Router):** React framework for building full-stack web applications.
* **React:** Frontend library for building user interfaces.
* **TypeScript:** Type-safe JavaScript for robust code.
* **Tailwind CSS:** Utility-first CSS framework for rapid styling.
* **Axios:** Promise-based HTTP client for making API requests.
* **Zod:** TypeScript-first schema declaration and validation library for form inputs.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (v18.x or later recommended)
* npm (v8.x or later) 

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Pikachu-345/tnp-task.git](https://github.com/Pikachu-345/tnp-task.git)
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd tnp-task
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
````

The application will be accessible at `http://localhost:3000`.

## Application Walkthrough

Follow these steps to navigate through the application's features:

1.  **Home Page (`/`)**

      * Upon launching the application, you'll land on a welcome page.
      * It provides a brief introduction to the portal.
      * Click the "Go to Login" button to proceed to the administrator login page.

2.  **Admin Login (`/login`)**

      * This is the entry point for administrators.
      * Enter the credentials and click "Login".
      * Successful login will redirect you to the Admin Panel. If login fails, an error message will be displayed.

3.  **Admin Panel (`/admin`)**

      * This is a protected route, accessible only after successful login.
      * Here, you can:
          * **Generate Shareable Link:** Click the "Generate Shareable Link" button. The application will make an API call to obtain a unique share token.
          * **Copy Link:** Once generated, the shareable link will be displayed. Click "Copy Link" to copy it to your clipboard.
          * **Logout:** Click the "Logout" button to clear your session and return to the login page.
      * If your access token expires, the application will attempt to refresh it automatically using your refresh token. If refresh fails, you'll be logged out.

4.  **Public Share Page (`/share/:token`)**

      * This page is publicly accessible and does not require a login.
      * Paste the copied shareable link (from the Admin Panel) into your browser's address bar and press Enter.
      * The page will fetch and display the associated student data in a table.
      * **Filter by Email:** Use the "Filter by Email" input field to dynamically narrow down the displayed student records based on their email addresses.
      * Error messages will be displayed if the share link is invalid, expired, or if no data is found.

## Deployment

This application is built with Next.js and deployed on [Vercel](https://vercel.com/).