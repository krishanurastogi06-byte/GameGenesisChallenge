# 🎮 GameGenesis Challenge - Professional Technical Escape Room

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GameGenesis Challenge** is an immersive, team-based technical escape room platform designed to test problem-solving, coding, and cybersecurity skills. Featuring a multi-level storyline, interactive puzzles, and real-time administrative monitoring, it provides a high-stakes environment for tech enthusiasts to showcase their expertise.

---

## 🚀 Project Overview

The project is structured as a full-stack ecosystem consisting of a player-facing **Frontend**, a robust **Backend API**, and a dedicated **Admin Dashboard** for live game orchestration.

### 🧩 Core Concept
Teams register as "Operatives," entering a digital world where they must navigate through 6 levels of increasing difficulty. Players can choose between **Cyber** and **Dev** paths, tailoring the challenge sequences to their specific skill sets.

---

## ✨ Key Features

- **🏆 Multi-Level Progression**: A structured 6-level journey with unique riddles and technical challenges.
- **🛣️ Dynamic Path Selection**: Specialized tracks for "Cyber Security Focus" and "Full-Stack Development Focus."
- **👥 Real-time Team Collaboration**: Synchronized game state for all team members.
- **📊 Live Admin Oversight**: A premium dashboard for monitoring team progress, level completion times, and system health.
- **🛡️ Secure Authentication**: JWT-based session management for both teams and administrators.
- **🎭 Immersive Storytelling**: Interactive "Storyline" segments that bridge the gap between technical puzzles.

---

## 🛠️ Technical Architecture

### **Frontend** (Player Client)
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Components**: Custom React 19 components with modern aesthetics.
- **Styling**: Vanilla CSS & Tailwind CSS for a premium, responsive look.
- **State Management**: Context-based team and game state tracking.

### **Backend** (Game Engine API)
- **Runtime**: Node.js & Express.
- **Database**: MongoDB (Mongoose ODM) for team persistence and audit logs.
- **Authentication**: `bcryptjs` for security and `jsonwebtoken` for stateless auth.
- **Architecture**: Controller-Route-Model (CRM) pattern for scalable maintainability.

### **Admin Dashboard** (Monitoring Tool)
- **Framework**: React 19 with Vite for ultra-fast HMR.
- **Visuals**: Framer Motion for smooth transitions and high-end animations.
- **Styling**: Tailwind CSS 4.0 for cutting-edge utility-first design.

---

## 📁 Repository Structure

```tree
.
├── admin/          # Vite + React Admin Dashboard
├── backend/        # Express.js REST API
├── frontend/       # Next.js Player Interface
└── README.md       # Project Documentation (You are here)
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- **Node.js**: v20.0 or higher
- **MongoDB**: A local instance or a MongoDB Atlas cluster URI
- **Git**: To clone the repository

### 2. Clone the Repository
```bash
git clone https://github.com/krishanurastogi06-byte/GameGenesisChallenge.git
cd GameGenesisChallenge
```

### 3. Environment Configuration
Each service requires its own `.env` file. Refer to the table below:

| Module | Expected Variables |
| :--- | :--- |
| **Backend** | `MONGO_URI`, `JWT_SECRET`, `PORT=5000` |
| **Frontend** | `NEXT_PUBLIC_API_URL` |
| **Admin** | `VITE_API_URL` |

### 4. Running the Services

#### **Step A: Start the Backend**
```bash
cd backend
npm install
npm run dev
```

#### **Step B: Start the Player Frontend**
```bash
cd frontend
npm install
npm run dev
```

#### **Step C: Start the Admin Dashboard (Optional)**
```bash
cd admin
npm install
npm run dev
```

---

## 🛡️ Security & Performance
- **Password Hashing**: Industry-standard `bcrypt` with salt rounds.
- **Stateless Auth**: JWT prevents session hijacking and enables horizontally scaled backends.
- **Optimized UI**: Next.js 16 server-side optimizations for blazing-fast initial page loads.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---

## 📞 Contact

**Krishanu Rastogi**
- **LinkedIn**: [in/krishanu-rastogi-](https://www.linkedin.com/in/krishanu-rastogi-/)
- **Email**: [krishanurastogi@gmail.com](mailto:krishanurastogi@gmail.com)

---
*Built with ❤️ for the Developer Community.*
