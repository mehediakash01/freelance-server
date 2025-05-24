# RedLink server

## 🌐 Live Server URL
[https://task-sphere-server.vercel.app](https://task-sphere-server.vercel.app)  
*(Replace this with your actual live server URL)*

---

## 📝 Description

This is the **backend server** for **RedLink**, a task-posting and bidding platform where users can post tasks, bid on available jobs, and manage their postings.

---

## 🔧 Server Features

-  🔐 **Authentication with Firebase** – Verifies user identity using Firebase Admin SDK for JWT verification.
- 📬 **Post & Fetch Tasks by Email** – Users can create, view, and manage their tasks using email identification.
- 📊 **Real-Time Bid Count Updating** – Tracks number of bids per task dynamically.
- 🗑️ **Task Deletion with Confirmation** – Supports deleting tasks with safety confirmation prompts.
- 🔒 **Protected API Routes** – Only authenticated users can access sensitive routes like posting or deleting tasks.
- 🔄 **Task Update Endpoint** – Allows users to update task details securely by task ID.
- 📁 **MongoDB Integration** – Uses MongoDB with Mongoose for storing task data.

---

## 🚀 Technologies Used

- Node.js
- Express.js
- MongoDB 
- CORS and dotenv for environment handling

---

