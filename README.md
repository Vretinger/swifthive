# 🌐 Swifthive – Find & Hire Freelancers

Swifthive is a full-stack web platform that allows users to register as **freelancers** or **clients**, enabling job listings, applications, profile creation and view job application status. It aims to streamline the freelancing process with an intuitive UI and secure back-end.

---

## 📁 Table of Contents

* [Project Overview](#project-overview)
* [Live Demo](#live-demo)
* [User Types & Key Features](#user-types--key-features)
* [UX & Design](#ux--design)
* [Tech Stack](#tech-stack)
* [Data Models](#data-models)
* [User Stories](#user-stories)
* [Component Structure](#component-structure)
* [Installation](#installation)
* [Deployment](#deployment)
* [Testing](#testing)
* [Agile Workflow](#agile-workflow)
* [Security](#security)
* [Credits](#credits)

---

## 📌 Project Overview

Swifthive connects freelancers and clients in a modern marketplace for remote work. Built with React and Django REST Framework, users can create profiles, post jobs, apply to gigs, and manage hiring—all within one platform.

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Screenshot of homepage showing "Find Jobs" or "Post a Job" -->`

---

## 🌍 Live Demo

* **Front-End:** [Swifthive Front-End](#)
* **Back-End API:** [Swifthive API](#)

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Screenshot of deployed site landing page or login page -->`

---

## 👥 User Types & Key Features

### 🎯 Clients

* Register and create job postings
* Browse freelancer profiles
* View applications and hire candidates

### 👷 Freelancers

* Register and build a profile
* Browse job listings
* Apply for jobs with a custom pitch

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Side-by-side screenshots of client and freelancer dashboards -->`

---

## 🎨 UX & Design

Designed for clarity, ease-of-use, and responsiveness. Color-coded statuses and clear CTAs guide users through hiring or applying.

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Figma/wireframe preview or mobile vs desktop mockups -->`

---

## 🧰 Tech Stack

### Front-End

* React + React Router
* Axios for API requests
* Context API / useState for state management
* Tailwind / Bootstrap for styling

### Back-End

* Django REST Framework
* PostgreSQL
* JWT Auth
* Cloudinary for media (e.g. user avatars, portfolio files)

---

## 📦 Data Models

### `User`

* Role: `freelancer` or `client`
* Name, Email, Profile Info, Avatar

### `Job`

* Title, Description, Created by, Status

### `Application`

* Linked Job and Freelancer
* Pitch, Date, Status

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Diagram of model relationships (User → Job → Application) -->`

---

## 💡 User Stories

| Role       | Story                                                                |
| ---------- | -------------------------------------------------------------------- |
| Client     | As a client, I want to post a job so that freelancers can apply      |
| Freelancer | As a freelancer, I want to create a profile to showcase my skills    |
| Freelancer | As a freelancer, I want to apply to jobs with a custom message       |
| Client     | As a client, I want to view applicants and select the best candidate |

---

## 🧱 Component Structure

React components are structured modularly for maintainability:

* `Header.js` – Site-wide navigation
* `JobList.js` – Renders available jobs
* `JobPostForm.js` – Job creation/edit form
* `ProfileCard.js` – Shows freelancer details
* `Dashboard.js` – Client/freelancer home screen

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Component tree or folder structure screenshot -->`

---

## 💻 Installation

### Clone the Repo

```bash
git clone https://github.com/yourusername/swifthive.git
cd swifthive
npm install
```

### Back-End Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

---

## 🚀 Deployment

* Front-End deployed via Vercel / Netlify
* Back-End deployed via Render / Heroku
* Environment variables secured in `.env`

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Screenshot of deployed site + API response in Postman -->`

---

## 🥮 Testing

### Manual Testing

* Registered as both user types and walked through job creation & application flow
* Edge case form validation (e.g., empty inputs, large files)
* Responsive testing (Chrome DevTools mobile mode)

### Automated Testing

* Unit tests for core models (User, Job, Application)
* API endpoint tests (DRF test client)

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Screenshot of test output or coverage report -->`

---

## 🗓️ Agile Workflow

Agile methodology was followed using Trello/GitHub Projects:

* User stories tracked in sprints
* Regular commits with clear messages

> 🖼️ **Image placeholder:**
> `<!-- PLACEHOLDER: Screenshot of Trello board or GitHub Projects board -->`

---

## 🔒 Security

* JWT Authentication
* CSRF protection
* `.env` variables excluded from version control

---

## 🙏 Credits

* Icons from [Font Awesome](https://fontawesome.com/)
* Profile Avatars from [Random User Generator](https://randomuser.me/)
* Cloudinary for media hosting
* Django & React documentation
