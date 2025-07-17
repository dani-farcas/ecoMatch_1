# 📚 ecoMatch – Setup & Deployment Guide

## 🚀 Overview

ecoMatch is a full-stack project with React (frontend), Django REST API (backend), PostgreSQL database, all containerized via Docker Compose. Production-ready setup includes Nginx as reverse proxy and pgAdmin for DB management.

---

## 📁 Project Structure

```
project_root/
│
├── backend/              # Django backend
│   ├── .env.dev
│   ├── .env.prod
│   └── .env.example
│
├── frontend/             # React frontend
├── nginx/                # Nginx configuration
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md             # this file
```

---

## 💻 Local Development (Docker Compose)

### ✅ 1. Clone the project

```bash
git clone https://github.com/your-username/ecoMatch.git
cd ecoMatch
```

### ✅ 2. Configure Environment Variables

In `backend/`:

```bash
cp .env.example .env.dev
```

Adjust credentials (optional).

### ✅ 3. Start the full stack (React + Django + DB)

```bash
docker compose -f docker-compose.yml up -d --build
```

### ✅ 4. Setup Django

```bash
docker compose exec backend python manage.py migrate
# optional admin user
docker compose exec backend python manage.py createsuperuser
```

### ✅ 5. Access Locally

* Frontend (React build): [http://localhost](http://localhost)
* Django Admin: [http://localhost/admin/](http://localhost/admin/)
* pgAdmin: [http://localhost:5050](http://localhost:5050) (login: [admin@ecomatch.local](mailto:admin@ecomatch.local) / admin123)

---

## 🌐 Production Deployment (AWS EC2)

### ✅ 1. Setup EC2 Instance

* Ubuntu Server 24.04 LTS
* Install Docker + Docker Compose

### ✅ 2. Clone and Setup Environment

```bash
git clone https://github.com/your-username/ecoMatch.git
cd ecoMatch
cp backend/.env.example backend/.env.prod
# edit backend/.env.prod for production
```

### ✅ 3. Start Production Stack

```bash
docker compose -f docker-compose.yml up -d --build
```

### ✅ 4. Collect Static Files

```bash
docker compose exec backend python manage.py collectstatic --noinput
```

### ✅ 5. Migrate Database and Create Superuser

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

### ✅ 6. Server Access Points

* Website: [http://your-ec2-ip/](http://your-ec2-ip/)
* Admin Panel: [http://your-ec2-ip/admin/](http://your-ec2-ip/admin/)
* pgAdmin: [http://your-ec2-ip:5050](http://your-ec2-ip:5050)

✅ You can add your domain and SSL later via Nginx configuration.

---

## ⚙️ Docker Compose Services Explained

| Service  | Description                                |
| -------- | ------------------------------------------ |
| db       | PostgreSQL database                        |
| pgadmin  | DB Admin Panel on port 5050                |
| backend  | Django REST API served by Gunicorn         |
| frontend | React app build handled in Docker          |
| nginx    | Reverse Proxy + static/media files + React |

---

## 🟢 Useful Commands

### View Logs:

```bash
docker compose logs -f backend
docker compose logs -f nginx
```

### Stop & Remove Containers:

```bash
docker compose down
```

### Rebuild Everything:

```bash
docker compose down && docker compose up -d --build
```

---

## ✅ Best Practices

* Use `.env.prod` for production secrets (never commit!)
* Frontend is served via Nginx from React build folder.
* Admin and API routed via Nginx (`/admin/`, `/api/`).
* pgAdmin available for DB inspection.

---

## 📌 Future Improvements

* [ ] SSL with Let’s Encrypt via Nginx
* [ ] Frontend React on AWS S3 + CloudFront
* [ ] AWS RDS for database
* [ ] Auto-deployment via GitHub Actions

✅ Ready to deploy and scale!
