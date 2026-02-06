# 📂 Drive App – File Storage & Management System  

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)  
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)  

---

## 📌 Overview  
**Drive App** is a Google Drive–like **file management system** built with **Spring Boot, React, and MongoDB**.  
It allows users to upload, view, search, download, and delete files seamlessly with support for large file uploads (up to 500MB).

---

## 🚀 Live Demo  
- **Frontend:** [https://drive-app13.netlify.app](https://drive-app13.netlify.app)  
- **Backend API:** [https://drive-app-1-24vo.onrender.com](https://drive-app-1-24vo.onrender.com)  

---

## 🛠️ Tech Stack  
- **Frontend:** React, Axios, CSS  
- **Backend:** Spring Boot (Java 21), Spring Data MongoDB  
- **Database:** MongoDB Atlas  
- **Deployment:** Netlify (Frontend), Render (Backend)  
- **Build Tools:** Maven (backend), npm (frontend)  

---

## ⚙️ Features  
✅ Upload files up to 500MB  
✅ List all uploaded files with metadata  
✅ Download files by clicking  
✅ Delete files with confirmation  
✅ Search files by name  
✅ Star/favorite files  
✅ Move files to trash  
✅ Organize files by categories  

---

## 📦 Installation & Setup  

### Prerequisites  
- **Java 21** or higher  
- **Node.js 18+** and npm  
- **MongoDB Atlas** account (or local MongoDB instance)  

### Backend Setup  

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditeeping13/Drive-app.git
   cd Drive-app/backend
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drive_db?appName=Cluster0
   FRONTEND_URL=http://localhost:3000
   ```

3. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup  

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env.development` file:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

---

## 🔧 Configuration  

### MongoDB Atlas Setup  
1. Create a MongoDB Atlas account at [cloud.mongodb.com](https://cloud.mongodb.com)  
2. Create a new cluster  
3. Under **Network Access**, add IP `0.0.0.0/0` to allow connections from anywhere  
4. Create a database user with read/write permissions  
5. Copy the connection string and update `MONGODB_URI` in your `.env` file  

### CORS Configuration  
The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://drive-app13.netlify.app` (production)

To add more origins, update `FRONTEND_URL` in your environment variables as a comma-separated list.

---

## 📁 Project Structure  

```
Drive-app/
├── backend/
│   ├── src/main/java/com/genie/Drive_BE/
│   │   ├── controller/      # REST API endpoints
│   │   ├── entity/          # MongoDB document models
│   │   ├── repo/            # MongoDB repositories
│   │   ├── services/        # Business logic
│   │   └── Corsconfig/      # CORS configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🌐 API Endpoints  

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload a file |
| GET | `/api/files` | Get all files |
| GET | `/api/files/{id}` | Get file by ID |
| DELETE | `/api/files/{id}` | Delete a file |
| GET | `/api/files/download/{id}` | Download a file |
| GET | `/api/files/storage-stats` | Get storage statistics |

---

## 🐛 Troubleshooting  

### MongoDB Connection Issues  
- Ensure your IP is whitelisted in MongoDB Atlas Network Access  
- Verify the connection string format is correct  
- Check that database user has proper permissions  

### File Upload Errors  
- Maximum file size is set to 500MB  
- Ensure sufficient disk space on the server  

### CORS Errors  
- Verify `FRONTEND_URL` environment variable includes your frontend URL  
- Check that the frontend is making requests to the correct backend URL  

---

## 📄 License  
This project is open source and available under the MIT License.

---

## 👨‍💻 Author  
**Aditee**  
- GitHub: [@aditeeping13](https://github.com/aditeeping13)  
