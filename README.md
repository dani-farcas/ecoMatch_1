# 🌱 ecoMatch – Smart B2B Service Matching Platform

**ecoMatch** is a full-stack web application that connects **clients** (e.g. municipalities or companies) with suitable **service providers** in their region – based on service type, location, and availability.

---

## 🚀 Key Features

- Role-based access: **Client** (e.g. public authority) and **Provider** (service company)
- Secure registration & login with **email confirmation**
- Dynamic **project request form** with validation and file/image upload
- **Smart matching algorithm** based on selected services and provider coverage area
- Modern, mobile-friendly UI with **dark mode** and **responsive dashboards**
- JWT authentication & role-specific routes
- Optional: profile image upload, edit, delete
- Planned: **Subscription system via Stripe or Mollie**

---

## 🧱 Tech Stack

### 🔹 Frontend
- **React** with **TypeScript**
- **Vite** (replaced CRA for better performance)
- **Zustand** for state management
- React Router, Axios, React Icons
- Dark Mode using `useState` + `localStorage`
- Deployment: **Vercel**

### 🔹 Backend
- **Django 5** + **Django REST Framework**
- JWT Authentication (`SimpleJWT`)
- PostgreSQL database
- Role-based ViewSets & permission system
- File/image upload & media handling
- Deployment: **Render**

---

## 📂 Project Structure (excerpt)

ecoMatch/
├── backend/
│ ├── core/
│ │ ├── models.py
│ │ └── views.py
│ ├── api/
│ │ ├── serializers.py
│ │ └── urls.py
│ └── config/
│ ├── settings.py
│ └── wsgi.py
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.tsx
│ │ │ ├── Signup.tsx
│ │ │ └── dashboard/
│ │ │ ├── ClientDashboard.tsx
│ │ │ └── ProviderDashboard.tsx
│ ├── assets/
│ └── styles/
└── README.md


---

## 🔐 Security & Architecture

- Secure handling of secrets using `.env` files for dev & production
- JWT token system with refresh, token expiry & logout
- Protected API routes + frontend route guards
- Input validations (email, phone number, postal code, URLs)
- Profile/logo image preview, live validation, and deletion

---

## 📈 Next Steps

- Integration of **Stripe/Mollie** for managing subscriptions and checkout
- Admin dashboard for analytics, user & request management
- Email notifications & system messages
- Feedback system (ratings/reviews) for completed services
- Performance monitoring and logging (Sentry, LogRocket, etc.)
- Multilingual support (de / en / ro)

---

## 📌 Project Status

🟢 **Actively in development**  
🔒 **Private codebase** – this overview is for documentation & presentation only  
📞 Interested in collaboration? Reach out via GitHub: [@dani-farcas](https://github.com/dani-farcas)
