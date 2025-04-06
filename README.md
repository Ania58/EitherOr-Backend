# EitherOr – Backend

This is the **backend** for the EitherOr application — a "Would You Rather" style platform where users can create thought-provoking questions, vote, and comment on them. It is built with **Node.js**, **Express**, **MongoDB**, and uses **Firebase Authentication** for secure user management.

---

## 🧠 Features

- ✅ Create, edit, and delete questions (with authentication).
- 🗳️ Vote on questions anonymously or as a logged-in user.
- 💬 Post, edit, and delete comments on questions.
- 🔥 Filter and sort questions by newest, most popular, or weirdest.
- 🔐 Authenticated routes using Firebase ID tokens.
- 🌐 RESTful API documented via Postman.

---

## 📬 API Documentation

👉 You can find the full interactive API documentation here:  
**[View on Postman](https://documenter.getpostman.com/view/38010309/2sB2cUC3ZZ)**

This includes all endpoints, request/response formats, and example queries.

---

## ⚙️ Technologies Used

- **Node.js** + **Express** – Backend framework and routing
- **MongoDB** – NoSQL database for storing questions and comments
- **Firebase Admin SDK** – Token verification for authenticated users
- **Mongoose** – ODM for MongoDB
- **CORS**, **dotenv**, and other middleware

---

## 📂 Project Structure

```
eitheror-backend/
├── config/
│   └── db.js
├── controllers/
│   └── questionController.js
├── middlewares/
│   ├── verifyToken.js
│   └── verifyEmailAndUid.js
├── models/
│   └── Question.js
├── routes/
│   ├── auth.js
│   └── questions.js
├── .env
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Installation & Running Locally

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/eitheror-backend.git
   cd eitheror-backend

2. **Install dependencies:**
```bash
npm install
```

3. **Create a .env file and add:**

```
MONGODB_URI=your_mongodb_uri_here
FIREBASE_PROJECT_ID=your_project_id
```
4. **Run the server:**
```bash
npm start
```
OR 
```bash
nodemon server.js
```

## 🔐 Authentication

Authenticated routes (like posting comments or creating questions) require a Firebase ID token in the Authorization header:

```makefile
Authorization: Bearer <token>
```
Anonymous users can still read questions and vote.

## ✨ Sample Routes

```
GET     /questions/                     → Get all questions  
GET     /questions/:id                  → Get a specific question by ID  
GET     /questions/random               → Get a random question  
POST    /questions/create               → Create a new question (requires auth)  
PUT     /questions/:id/edit             → Edit a question (requires auth)  
DELETE  /questions/:id/delete           → Delete a question (requires auth)  

POST    /questions/:id/vote             → Vote on a question  
GET     /questions/:id/results          → Get voting results  
PUT     /questions/:id/weird            → Mark question as weird  

GET     /questions/:id/comments         → Get comments for a question  
POST    /questions/:id/comments         → Add a comment (requires auth)  
PUT     /questions/:id/comments         → Update a comment (requires auth)  
DELETE  /questions/:id/comments         → Delete a comment (requires auth)  
```
