# Lecturely 🎓📒

Lecturely is a full‑stack web application that helps students convert recorded lectures into structured, editable study notes. It focuses on **productivity, clarity, and usability**, allowing users to manage lectures, view generated notes, highlight important parts, and export notes in multiple formats.

---

## ✨ Key Features

### 📂 Lecture Management

* Upload and manage lecture audio files
* Track lecture processing status (pending / completed)

### 📝 Notes System

* Automatically generated notes (AI‑assisted – optional)
* Manual editing of notes
* Highlight important text
* Remove highlights when needed

### 📑 Auto Chapters

* Lecture is split into meaningful chapters
* Each chapter contains:

  * Title
  * Short summary
  * Time range

### 📤 Export Options

* Download notes as:

  * PDF
  * TXT
  

### 🔐 Authentication

* Secure user authentication using JWT
* Notes are user‑specific

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* jsPDF

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

### Optional AI Integrations

* AssemblyAI (speech‑to‑text & chapters)
* 
## 🚀 How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/lecturely.git
cd lecturely
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run server
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
ASSEMBLYAI_API_KEY=optional
CLOUDINARY_CLOUD_NAME="cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📌 Project Status

* Core features: ✅ Completed
* AI features: ⚠️ Experimental


## 💡 Why This Project?

Lecturely solves a **real student problem**: converting long lectures into usable notes. It focuses on:

* Clean UI
* Practical features
* Real‑world backend architecture

---

## 👩‍💻 Author

**Suhani Kabra**

* B.Tech Student
* Interests: Full‑Stack Development, Product‑based Systems

---

## ⭐ Future Improvements

* Flashcards from highlighted text
* Quiz generation

---

