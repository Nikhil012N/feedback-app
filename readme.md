  Feedback API - Documentation

Feedback API - Documentation
============================

✨ Overview
----------

This project provides secure APIs to create and retrieve user feedbacks with optional image uploads. It is built using **Next.js Route Handlers** and **MongoDB**.

📦 Features
-----------

*   User Authentication using JWT Token.
*   Upload feedbacks with optional image files.
*   Files are stored inside the `public/uploads/` folder.
*   Input validation for feedback details and ratings.
*   Fetch all feedbacks for the authenticated user.

🚀 Tech Stack
-------------

*   Next.js (App Router)
*   MongoDB & Mongoose
*   JWT for authentication
*   Pure Node.js FileSystem API for uploads (no Multer required)

📂 Project Structure
--------------------

/
├── app/
│   └── api/
│       └── feedback/
│           └── route.js
├── lib/
│   └── db.js
├── models/
│   ├── user.js
│   ├── feedback.js
├── public/
│   └── uploads/
└── .env.local
    

🔑 API Endpoints
----------------

### 1\. GET /api/feedback

*   **Description:** Fetch all feedbacks of the authenticated user.
*   **Headers:** Authorization: Bearer <token>
*   **Response:** JSON array of feedback objects.

### 2\. POST /api/feedback

*   **Description:** Submit a new feedback with optional image upload.
*   **Headers:** Authorization: Bearer <token>
*   **Body (FormData):**
    *   `title` (string) - Required
    *   `content` (string) - Required
    *   `rating` (number between 1-5) - Required
    *   `image` (File) - Optional
*   **Response:** JSON object of the created feedback.

⚙️ Environment Variables
------------------------

Create a `.env.local` file in the root of the project and add the following:

MONGODB\_URI=your-mongodb-connection-string
JWT\_SECRET=your-jwt-secret
GROQ\_API\_KEY= your-api-secret
    

🖼️ Uploaded Files
------------------

All uploaded images are stored inside the `public/uploads/` folder and can be accessed publicly via:

`http://yourdomain.com/uploads/filename.jpg`

💡 Installation and Setup
-------------------------

### 1\. Clone the Repository

git clone https://github.com/nikhil012n/feedback-app.git
cd feedback-app
    

### 2\. Install Dependencies

npm install
    

### 3\. Setup Environment Variables

Create a `.env.local` file and add your MongoDB URI and JWT secret.

### 4\. Run the Development Server

npm run dev
    

💡 Seeding the Database (Optional)
----------------------------------

If you want to create a sample user for testing purposes, you can manually insert a user into MongoDB with hashed password using bcrypt, or create a simple signup API route.

✅ Future Improvements
---------------------

*   Validate uploaded file types (allow only jpg, png).
*   Limit maximum upload file size (5MB).
*   Add Admin APIs to view and reply to feedbacks.

✍️ Author
---------

Developed with 💻 by **Nikhil**.