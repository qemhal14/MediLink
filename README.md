# 🩺 MediLink: Hospital & Clinic Management App

MediLink is a modern, responsive, AI-integrated hospital and clinic management dashboard designed to streamline the workflows of **Admins/Receptionists**, **Nurses**, and **Doctors**. With features ranging from patient registration and room management to **Gemini-powered clinical diagnostic assistance**, MediLink unites clinical staff on a unified digital workstation.

---

## 🌟 App Overview & Intended Use Case

MediLink is built to mirror real-world clinical and hospital operations. The system coordinates the lifecycle of a patient visit from check-in to clinical assessment:

```
[Patient Arrival] ──> [Admin/Receptionist] ──> [Nurse Assessment] ──> [Doctor Consultation]
                            │                        │                       │
                            ├── Registers Patient    └── Measures Vitals     └── Performs Checkup
                            └── Schedules Appt.      └── Logs Symptoms       └── Runs Gemini AI Analysis
```

### The Typical Workflow:
1. **Patient Check-in**: The **Admin/Receptionist** registers the patient, creates their digital record, and schedules an appointment with a doctor, assigning them a status and room.
2. **Initial Assessment**: The **Nurse** pulls up the patient from the checkup queue, measures their vital signs (blood pressure, heart rate, temperature, weight, height), notes symptoms, and saves the initial data.
3. **Clinical Consultation & AI Diagnosis**: The **Doctor** accesses the patient record, reviews the nurse's vitals, inputs their physical findings, and triggers the **Gemini AI Diagnosis Assistant** to obtain real-time suggestions (possible diagnoses, risk factors, confidence explanations, and follow-up guidance) before finalizing the treatment plan.

---

## 👥 Role Permissions & Features

MediLink provides tailor-made dashboards based on the user's role:

### 1. 🏢 Admin / Receptionist
- **Patient Registration**: Search for existing patients or register new patients using their government ID (NIK).
- **Appointment Scheduling**: Allocate patients to specific doctors and set visit schedules.
- **Room Management**: View and modify room availability status (`Available` vs `Occupied`) in real-time.
- **Announcement Board**: Publish urgent or regular messages to all staff members (with urgency markers and real-time alerts).

### 2. 🩺 Nurse
- **Patient Queue**: Track today's scheduled appointments and queue list.
- **Vitals Assessment**: Input initial checkup data (temperature, heart rate, blood pressure, weight, height, and main symptom complaint notes) for any active appointment.
- **Automatic Sync**: Vitals are dynamically attached to the patient's record, ready for the doctor's review.

### 3. 🥼 Doctor
- **Clinical Dashboard**: Manage patient consultations, write medical notes, and review history.
- **Nurse Vitals Integration**: Direct one-click import of the nurse's initial checkup data.
- **Gemini AI Assistant**: Get suggestions on possible diagnoses, risk factors, and recommended clinical actions based on the patient's vitals, symptoms, history, and physical exam findings.
- **Checkup History**: Create and review comprehensive historical patient checkup files.

---

## 🚀 The Try Demo Mode feature

To showcase the app's full capabilities without manual registrations or databases setup, MediLink features a **Try Demo Mode**.

> [!TIP]
> Use Demo Mode to instantly see how MediLink operates when populated with rich, realistic clinical history, dynamic charts, and live appointments.

### 📖 Tutorial: How to Use Demo Mode
1. **Select a Role**: On the landing page (`http://localhost:3000`), click on any of the three role cards:
   - **Admin/Receptionist**
   - **Nurse**
   - **Doctor**
2. **Launch Demo Mode**:
   - On the login screen, click the secondary **Try Demo Mode** button.
   - The app will display an overlay: *"Initializing demo data..."* followed by *"Logging in as Demo..."*
3. **Explore populated Dashboard**:
   - You will be automatically redirected to the dashboard.
   - **Statistics & Charts**: The app automatically seeds historical appointments spanning the last 7 days and 6 months to display responsive line and bar charts (Patients per Day/Month).
   - **Active Data**: 6 mock patients (complete with medical history and pre-filled vital data), multiple scheduled appointments for **Today**, and active announcements are seeded into the system.
   - **Cross-Role Flow**: You can return to the role selection page, switch roles, and use Demo Mode on another role to see how data entered by the Nurse is immediately visible and actionable for the Doctor.

---

## 🛠️ Technology Stack

**Frontend:**
- **Core**: React, React Router (v7)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts (for weekly and monthly analytics charts)
- **State & Utilities**: Context API, Axios, date-fns (for date calculations)
- **Notifications**: React Hot Toast

**Backend:**
- **Server**: Node.js, Express
- **Authentication**: Passport.js (Local & JWT strategies)
- **Database**: MongoDB (Mongoose ODM)
- **Artificial Intelligence**: `@google/generative-ai` (Gemini 1.5 Flash API)

---

## ⚙️ Installation & Setup

Follow these steps to run the MediLink application on your local machine:

### Prerequisites
- Node.js installed (v16+)
- A MongoDB cluster or local database instance
- A Google Gemini API Key (obtainable from Google AI Studio)

### 1. Configure Environmental Variables

#### Backend Environment
Create a `.env` file inside the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_uri
PORT=5000
REACT_APP_API_URL=http://localhost:5000

# Google Gemini AI Config
GOOGLE_AI_API_KEY=your_gemini_api_key
```

#### Frontend Environment
Create a `.env` file inside the `frontend/bingungcore/` directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 2. Install & Run Backend
```bash
cd backend
npm install
npm start
```
The API server will launch on `http://localhost:5000`.

### 3. Install & Run Frontend
```bash
cd frontend/bingungcore
npm install
npm start
```
The React development server will compile and open the client on `http://localhost:3000`.

---

## ⚠️ Troubleshooting & Network Setup

> [!WARNING]
> **MongoDB Atlas IP Whitelist Alert**:
> If the backend server fails to start or outputs `MongoDB connection failed: Could not connect to any servers in your MongoDB Atlas cluster`, this usually means your current IP address is not whitelisted in your Atlas cluster configuration. 
> To resolve this, log into your [MongoDB Atlas Console](https://cloud.mongodb.com/) and add your current IP address to the **Network Access IP Access List**.
