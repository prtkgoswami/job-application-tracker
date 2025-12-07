# JobTrackr
> **Live URL:** https://job-application-tracker-livid-seven.vercel.app/

A clean and efficient job application tracker built with **Next.js**, **Firebase**, and **Tailwind CSS**.  
Track roles, save job descriptions, store links, and monitor your application pipeline — all in one simple dashboard.

![Job Application Dashboard Screenshot](https://github.com/prtkgoswami/job-application-tracker/blob/main/public/job_tracker_dashboard.png)

---

## ✨ Features

- 🔐 User Authentication (Firebase Auth)
- 🗂️ Track job title, link, description, and status
- 🔄 Real-time updates using Firestore
- 📌 Status tracking (Applied → Interviewing → Offer → Rejected)
- 📝 Rich job description storage with preserved formatting
- 📱 Responsive and clean UI with Tailwind CSS
- 🚀 Fully client-side with cloud persistence

---

## 🧱 Tech Stack

| Category | Technology |
|---------|------------|
| Frontend | Next.js (App Router), React |
| Styling | Tailwind CSS |
| Backend | Firebase (Auth + Firestore) |
| State | React Hooks |
| Deploy | Vercel (recommended) |

---

## 📦 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/prtkgoswami/job-application-tracker.git
cd job-tracker
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add environment variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

Get these from Firebase → Project Settings → Web App Config.

### 4️⃣ Run locally

```bash
npm run dev
```

The app should be available at:

👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 Firestore Security Rules

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jobs/{jobId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Publish these in Firebase Console → Firestore → Rules.

---

## 🚀 Deployment

Deploy easily using **Vercel**:

```bash
npm run build
```

Then connect your GitHub repo to Vercel or run:

```bash
vercel
```

---

## 📌 Roadmap

* 🔎 Search + filter jobs
* 🏷️ Tags for roles (frontend, backend, etc.)
* 📊 Visual dashboards + stats
* 🤖 Smart parsing for responsibilities, requirements, & location
* 📱 PWA support for mobile use

