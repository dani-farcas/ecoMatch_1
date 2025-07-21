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

- Frontend (React build): [http://localhost](http://localhost)
- Django Admin: [http://localhost/admin/](http://localhost/admin/)
- pgAdmin: [http://localhost:5050](http://localhost:5050) (login: [admin@ecomatch.local](mailto:admin@ecomatch.local) / admin123)

---

## 🌐 Production Deployment (AWS EC2)

### ✅ 1. Setup EC2 Instance

- Ubuntu Server 24.04 LTS
- Install Docker + Docker Compose

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

- Website: [http://your-ec2-ip/](http://your-ec2-ip/)
- Admin Panel: [http://your-ec2-ip/admin/](http://your-ec2-ip/admin/)
- pgAdmin: [http://your-ec2-ip:5050](http://your-ec2-ip:5050)

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

- Use `.env.prod` for production secrets (never commit!)
- Frontend is served via Nginx from React build folder.
- Admin and API routed via Nginx (`/admin/`, `/api/`).
- pgAdmin available for DB inspection.

---

## 📌 Future Improvements

- [ ] SSL with Let’s Encrypt via Nginx
- [ ] Frontend React on AWS S3 + CloudFront
- [ ] AWS RDS for database
- [ ] Auto-deployment via GitHub Actions

# ✅ Ready to deploy and scale!

# ecoMatch

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/dani-farcas-group/ecoMatch.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/dani-farcas-group/ecoMatch/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
