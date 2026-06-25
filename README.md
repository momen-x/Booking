# Booking & Service Management System

A scalable service marketplace and booking platform built with **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Stripe**.

The platform allows users to browse providers, book services, manage appointments, process secure payments, and receive notifications. It also includes a complete provider onboarding workflow and role-based access control.

---

## Tech Stack

- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Passport.js
- Stripe
- Multer
- Cloudinary
- Swagger
- PNPM

---

## Features

### Authentication & Authorization

- JWT Authentication
- Secure HttpOnly Cookie Authentication
- Role-Based Access Control (RBAC)
- User Roles:
  - USER
  - PROVIDER
  - ADMIN

### User Management

- User Registration
- User Login / Logout
- Profile Management
- Password Updates
- Profile Image Upload

### Provider Management

- Provider Profile Creation
- Business Information Management
- Provider Dashboard
- Provider Status Management

### Provider Request Workflow

Users can apply to become service providers by submitting:

- Personal Information
- Government ID
- Selfie Verification
- Portfolio Images

Admins can:

- Review Requests
- Approve Requests
- Reject Requests

### Service Management

Providers can:

- Create Services
- Update Services
- Delete Services
- Upload Service Images
- Manage Pricing and Duration

### Availability Scheduling

Providers can:

- Define Weekly Availability
- Manage Working Hours
- Update Availability Slots

### Booking System

- Service Booking
- Conflict Detection
- Booking Validation
- Booking Status Tracking
- Soft Delete Support
- Automatic Expiration Handling

Booking statuses:

- PENDING
- CONFIRMED
- CANCELLED

### Payment Processing

Stripe Integration:

- Payment Intents
- Webhook Processing
- Payment Verification
- Refund Support

Payment statuses:

- PENDING
- SUCCESS
- FAILED
- REFUNDED

### Notifications

Users receive notifications for:

- Booking Events
- Payment Events
- Provider Requests
- System Messages

---

## Database Models

- User
- ProviderProfile
- Service
- Availability
- Booking
- Payment
- ProviderRequest
- Notification

---

## Architecture

The project follows a modular architecture and Repository Pattern.

Each module contains:

```text
module/
├── controller
├── service
├── repository
├── prisma-repository
├── dto
├── entity
└── module
```

### Layers

- **Controller Layer** → Handles HTTP requests and responses.
- **Service Layer** → Contains business logic and application rules.
- **Repository Layer** → Defines data access contracts.
- **Prisma Repository Layer** → Handles database operations using Prisma ORM.

This separation improves:

- Maintainability
- Scalability
- Testability
- Clean Architecture practices

---

## Project Structure

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

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd booking-system
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/booking_db"

JWT_SECRET="your_jwt_secret"

STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

CLOUDINARY_CLOUD_NAME="xxxxx"
CLOUDINARY_API_KEY="xxxxx"
CLOUDINARY_API_SECRET="xxxxx"
```

### Database Setup

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### Start Development Server

```bash
pnpm run start:dev
```

### Build Production Version

```bash
pnpm run build
```

### Run Production Server

```bash
pnpm run start:prod
```

---

## API Documentation

Swagger documentation is available at:

```text
http://localhost:5000/api
```

---

## Stripe Webhook

Configure Stripe Webhooks to:

```text
http://localhost:5000/api/payments/webhook
```

Production:

```text
https://your-domain.com/api/payments/webhook
```

---

## License

This project is licensed under the MIT License.
