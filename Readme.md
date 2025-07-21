# InternBoost 🌐

InternBoost is a full-stack internship management platform built with Node.js and MongoDB. It connects students and educational institutes, enabling smooth handling of internship applications, approvals, and course enrollments.

## ✨ Features

* 🔐 Role-based Authentication (Students & Institutes)
* 🧾 Student Dashboard: View internships, apply, and manage enrolled courses
* 🎓 Institute Panel: Post internships/courses, track applications
* ⏱ Session-based login with timeout handling
* 📄 File uploads and secure form submissions
* 🌐 MongoDB Atlas integration for cloud database
* 💡 Flash messages for instant user feedback
* 🎨 Dynamic EJS templating with modular routes
* 🗡 Environment variables handled via `.env`
* 📁 MVC folder structure

## 🛠️ Tech Stack

| Tech/Tool       | Purpose                          |
| --------------- | -------------------------------- |
| Node.js         | Backend runtime                  |
| Express.js      | Web framework                    |
| EJS             | Templating engine                |
| MongoDB Atlas   | Cloud-hosted NoSQL database      |
| Mongoose        | ODM for MongoDB                  |
| Express-Session | Session handling                 |
| Connect-Mongo   | Store sessions in MongoDB        |
| Flash           | Display success/error messages   |
| Multer          | File upload middleware (if used) |
| dotenv          | Environment variable management  |
| GitHub          | Source control                   |
| Render.com      | Deployment platform              |

## 📁 Folder Structure

```
/InternBoost
├── /routes
├── /views
├── /public
├── /uploads
├── server.js
├── .env (not tracked)
└── package.json
```

## ✨ Deployment

Live URL: [https://internboost-backend.onrender.com](https://internboost-backend.onrender.com)

## ⚙️ Run Locally

1. Clone the repository

   ```bash
   git clone https://github.com/developer-gulnaz/internboost.git
   cd internboost
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create `.env` file with:

   ```env
   MONGO_URI=your_mongodb_atlas_uri
   SESSION_SECRET=your_secret
   ```

4. Start the app

   ```bash
   node server.js
   ```

5. Access on

   ```
   http://localhost:3000
   ```

## 📷 Screenshots

(Add screenshots of home page, dashboard, login, etc.)

## 📜 Copyright

Copyright (c) 2025 Gulnaz Sheikh