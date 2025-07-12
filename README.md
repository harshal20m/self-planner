# 🗓️ Self Planner – A Day-wise Task Management App

A fully client-side React planner that allows users to create, manage, and track tasks for specific time slots in a day — all without any backend. Includes local authentication, editable plans, history tracking, and multiple tasks per slot.

## ✨ Features

-   🔐 **LocalStorage-based Login/Signup** (No backend required)
-   📅 **Day-wise Planner** with time slots
-   ➕ **Add Multiple Tasks per Time Slot**
-   ✅ **Mark Tasks as Done/Not Done**
-   📝 **Editable Plan Names and Times**
-   📊 **View Task History** (done & pending)
-   💾 **All Data Persisted via `localStorage`**

## 📁 Project Structure

```
self-planner/
│
├── index.html
├── package.json
├── vite.config.js
│
├── src/
│   ├── App.jsx                # Entry point with routing logic
│   ├── main.jsx               # Mounts React app
│   ├── index.css              # Global styles
│   │
│   ├── components/
│   │   ├── Auth.jsx           # Signup/Login logic using localStorage
│   │   ├── Planner.jsx        # Main planner interface per day
│   │   ├── TimeSlot.jsx       # Handles individual time slots and tasks
│   │   ├── AddTimeSlot.jsx    # Add new time slots dynamically
│   │   └── History.jsx        # Track past tasks (done/pending)
│   │
│   └── utils/
│       ├── storage.js         # Handles localStorage logic
│       └── timeUtils.js       # Utilities for sorting and time parsing
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (>= 16)
-   npm

### Installation

```bash
git clone https://github.com/harshal20m/self-planner.git
cd self-planner
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

## 🔐 Local Auth

-   The app uses `localStorage` to store user data.
-   New users can sign up with a username and password.
-   All planner data is scoped to the logged-in user.

## 🛠️ Tech Stack

-   **React + Vite**
-   **Tailwind CSS** (optional, based on `index.css`)
-   **Lucide Icons** (lightweight icons)
-   **LocalStorage** (for persistent auth and planner data)

## 📌 Roadmap / Future Ideas

-   🔔 Notifications for upcoming tasks
-   🗃️ Export history to CSV/JSON
-   🌙 Dark Mode toggle
-   📆 Weekly/Monthly planner view

## 🧑‍💻 Author

**Harshal Mali**  
[GitHub](https://github.com/harshal20m)
