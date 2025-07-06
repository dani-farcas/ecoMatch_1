# 🌱 ecoMatch – Smart B2B Service Matching Platform

**ecoMatch** is a full-stack web application that connects clients (e.g. municipalities or companies) with suitable service providers in their region – based on service type, location, and availability.

---

## 🚀 Key Features

- User roles: **Client** (e.g. public authority) and **Provider** (service company)
- Registration & Login with **email confirmation**
- Dynamic project request forms with validation and file upload
- Smart matching algorithm based on region and selected services
- Dark mode, responsive UI & modern dashboard
- PDF export of results
- Planned: Subscription system via Stripe/Mollie

---

## 🧱 Tech Stack

### 🔹 Frontend
- **React** with **TypeScript**
- Zustand for state management
- React Router, Axios, React Icons
- Dark Mode via `useState` & `localStorage`
- Deployment: **Vercel**

### 🔹 Backend
- **Django REST Framework**
- JWT Authentication with token refresh
- Role-based API architecture (Client / Provider)
- PostgreSQL Database
- Deployment: **Render**

---

## 📂 Project Structure (excerpt)

```text
ecoMatch/
├── backend/
│   ├── core/
│   │   ├── models.py
│   │   └── views.py
│   ├── api/
│   │   ├── serializers.py
│   │   └── urls.py
│   └── config/
│       └── settings.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── dashboard/ClientDashboard.tsx
│   ├── assets/
│   └── styles/
└── README.md

---

## 🔐 Security & Architecture

- Separate `.env` files for development & production  
- Secure API handling with token expiry and frontend error feedback  
- Upload preview, image deletion, and validation (phone, postal code, URL)

---

## 📈 Next Steps

- Integrate Stripe/Mollie for subscriptions  
- Build an admin dashboard for monitoring and analytics  
- Logging, monitoring, and performance optimization

---

## 📌 Project Status

🟢 **Actively in development**  
🔒 Source code is private – this file provides an overview only  
📞 Interested? Contact me via my GitHub profile: [dani-farcas](https://github.com/dani-farcas)
