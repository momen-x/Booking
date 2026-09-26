# Booking & Service Marketplace — Backend

A modular backend API for a multi-role booking platform built with **NestJS**, **PostgreSQL**, **Prisma ORM**, **JWT Authentication**, **Stripe**, and **Cloudinary**.

The backend supports authentication, provider onboarding, service management, availability scheduling, booking workflows, payments, notifications, and role-based access control.

---

## 🚀 Overview

The backend powers a service marketplace where:

- Users can register, browse services, and create bookings.
- Providers can manage services and availability.
- Admins can review provider requests and manage platform data.
- Payments are handled through Stripe.
- Images and verification media are handled through Cloudinary.

---

## ✨ Key Features

### Authentication & Authorization
- User registration
- Login / logout
- JWT authentication
- Refresh-token support
- Password hashing
- HttpOnly cookie authentication
- Role-Based Access Control (RBAC)

Supported roles:

- User
- Provider
- Admin

---

### User Management
- Profile management
- Password updates
- Profile image upload
- Account-level authorization

---

### Provider Management
- Provider profile creation
- Business information management
- Provider status management
- Provider dashboard data

---

### Provider Request Workflow

Users can apply to become service providers by submitting:

- Personal information
- Government ID
- Selfie verification
- Portfolio images

Admins can:

- Review requests
- Approve requests
- Reject requests

---

### Service Management
Providers can:

- Create services
- Update services
- Delete services
- Upload images
- Manage price and duration

---

### Availability Scheduling
Providers can:

- Configure weekly availability
- Set working hours
- Manage available slots

---

### Booking System

The booking system includes:

- Booking creation
- Conflict detection
- Booking validation
- Booking status tracking
- Soft delete support
- Automatic expiration handling

Booking statuses:

```text
PENDING
CONFIRMED
CANCELLED
```

---

### Payment Processing

Stripe integration includes:

- Payment Intents
- Webhook processing
- Payment verification
- Refund support

Payment statuses:

```text
PENDING
SUCCESS
FAILED
REFUNDED
```

---

### Notifications

Notifications are generated for:

- Booking events
- Payment events
- Provider request updates
- System messages

---

## 🧱 Architecture

The backend follows a modular architecture with clear separation between business logic and data access.

Each feature typically contains:

```text
module/
├── controller/
├── service/
├── repo/
├── dto/
├── entity/
└── module.ts
```

Main layers:

- **Controller Layer** — HTTP request/response handling
- **Service Layer** — business rules
- **Repository Layer** — data-access abstraction
- **Prisma Layer** — PostgreSQL operations through Prisma ORM

This structure improves:

- Maintainability
- Testability
- Scalability
- Separation of concerns
- Easier database-layer changes

---

## 🛠️ Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Passport.js
- Stripe
- Cloudinary
- Multer
- Swagger
- PNPM

---

## 📂 Project Structure

```text
src/
├── auth/
├── users/
├── provider-profile/
├── provider-request/
├── service/
├── availability/
├── bookings/
├── notifications/
├── payments/
├── infrastructure/
│   └── prisma/
├── config/
├── utils/
├── app.module.ts
└── main.ts
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/booking_db

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

> Never expose backend secret keys in frontend environment variables.

---

## 🗄️ Database

Main models include:

- User
- ProviderProfile
- Service
- Availability
- Booking
- Payment
- ProviderRequest
- Notification

---

## 🧪 API Documentation

Swagger documentation is available at:

```text
http://localhost:5000/api
```

---

## 💳 Stripe Webhook

Local:

```text
http://localhost:5000/api/payments/webhook
```

Production:

```text
https://your-domain.com/api/payments/webhook
```

---

## ▶️ Getting Started

### Install dependencies

```bash
pnpm install
```

### Generate Prisma client

```bash
pnpm prisma generate
```

### Run migrations

```bash
pnpm prisma migrate dev
```

### Start development server

```bash
pnpm run start:dev
```

---

## 🏗️ Production

```bash
pnpm run build
pnpm run start:prod
```

---

## 🎯 What I Learned

This project was one of my first large backend systems built with a structured architecture.

It helped me gain practical experience with:

- Modular backend architecture
- Repository pattern
- Multi-role authorization
- Secure authentication
- Booking domain logic
- Payment webhooks
- Database modeling
- Separation of business logic and persistence
- Designing larger applications without relying on tutorial structure

---

## 📌 Status

The project is maintained as a portfolio project demonstrating full-stack architecture and backend system design.

---

## 👨‍💻 Author

**Mo'men Alswafiri**

- GitHub: https://github.com/momen-x
- LinkedIn: https://www.linkedin.com/in/mo’men-alswafiri-8b6491346
