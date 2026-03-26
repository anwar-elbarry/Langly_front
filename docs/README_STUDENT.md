# Student Dashboard — User Guide

> **Role:** `STUDENT`  
> **Access Level:** Personal course access, enrollment & payments  
> **Login URL:** `/login`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard Pages](#dashboard-pages)
   - [My Courses](#my-courses)
   - [Course Detail](#course-detail)
   - [Enroll in a Course](#enroll-in-a-course)
   - [Certifications](#certifications)
   - [Invoices](#invoices--payments)
   - [My Fees](#my-fees)
   - [Fee Catalog](#fee-catalog)
   - [Settings](#settings)
4. [Key Workflows](#key-workflows)
   - [Enrollment Flow (End-to-End)](#enrollment-flow-end-to-end)
   - [Payment Flow](#payment-flow)
   - [Downloading Course Materials](#downloading-course-materials)
   - [Downloading Certificates](#downloading-certificates)

---

## Overview

As a **Student**, you browse available courses, request enrollment, pay for courses, access course materials, view attendance summaries, and download certifications upon completion.

**What you can do:**

- Browse and enroll in courses
- Pay for courses (Cash, Bank Transfer, or Stripe online)
- View attendance summaries (per course and global)
- Download course materials (PDFs, videos)
- View invoices, payment history, and fee tracking
- Download certifications when you pass

---

## Getting Started

1. Navigate to `/login` and enter your credentials.
2. Upon login, you are redirected to `/student/my-courses` (My Courses).
3. The **sidebar** (labels in French) provides access to: Mes Cours, S'inscrire, Certificats, Factures, Mes frais, Catalogue des frais, Paramètres.
4. If this is your first time, head to **S'inscrire** to browse available courses.

---

## Dashboard Pages

### My Courses

**Route:** `/student/my-courses`

Your main page — shows all courses you are enrolled in.

**Each course card shows:**

| Field | Description |
|-------|-------------|
| Course Name | Name of the course |
| Language | Language being taught |
| Level | Required level → Target level |
| Teacher | Your instructor |
| Status | Your enrollment status (badge) |
| Next Session | Date, time, and mode of the next upcoming session |

**Enrollment Status Badges:**

| Status | Color | Meaning |
|--------|-------|---------|
| `PENDING_APPROVAL` | Orange | Waiting for admin approval |
| `APPROVED` | Blue | Approved — pay to activate |
| `IN_PROGRESS` | Green | Active — you have full access |
| `PASSED` | Green | Completed — certificate available |
| `FAILED` | Red | Course not passed |
| `WITHDRAWN` | Gray | You withdrew from the course |

Click a course to open the detail page.

---

### Course Detail

**Route:** `/student/course-detail/:id`

Full view of a single course you're enrolled in.

**Sections:**

- **Course Info:** Name, code, language, levels, dates, teacher, capacity
- **Upcoming Sessions:** List of upcoming sessions with date, time, mode (Online/In-Person/Hybrid), room or meeting link
- **Course Materials:** Downloadable files (PDFs, videos) uploaded by your teacher
- **Attendance Summary:** Your attendance stats for this course
- **Enrollment Info:** Your enrollment status, certificate link (if PASSED)

---

### Enroll in a Course

**Route:** `/student/enroll`

Browse all available courses and request enrollment.

**Course listing shows:**

| Field | Description |
|-------|-------------|
| Name | Course name |
| Language | Language taught |
| Required Level | Your level must match this to enroll |
| Target Level | Level you'll achieve |
| Dates | Start – End dates |
| Capacity | Available spots |
| Price | Enrollment fee |
| Teacher | Instructor name |

**Enrollment restrictions:**
- Your current level must match (or exceed) the course's **Required Level**
- The course must have available capacity

Click **"Enroll"** to submit your enrollment request.

---

### Certifications

**Route:** `/student/certifications`

View and download your earned certifications.

**Each certification shows:**

| Field | Description |
|-------|-------------|
| Course Name | The course you completed |
| Language | Language of the certification |
| Level | Proficiency level achieved |
| Issue Date | When the certificate was issued |
| Digital Signature | Verification signature |

**Actions:**
- **Download PDF** — Get your official certificate document

> Certifications are automatically generated when your enrollment status is changed to **PASSED** by your teacher or school admin.

---

### Invoices & Payments

**Route:** `/student/invoices`  
**Invoice Detail:** `/student/invoices/:id`

View all your invoices and payment history.

**Each invoice shows:**

| Field | Description |
|-------|-------------|
| Course | Course name linked to this invoice |
| Amount | Payment amount |
| Status | PAID / PARTIALLY_PAID / UNPAID |
| Payment Method | Cash, Bank Transfer, or Stripe |
| Date Paid | When the payment was confirmed (if paid) |

**Invoice Status Badges:**

| Status | Color | Meaning |
|--------|-------|---------|
| `PAID` | Green | Fully paid |
| `PARTIALLY_PAID` | Blue | Partial payment (installment plan) |
| `UNPAID` | Red | Awaiting your payment |

**Invoice Detail Page:**
- Full payment details
- Payment schedule (if installment plan)
- Payment history (all payment attempts)
- Download invoice PDF

---

### My Fees

**Route:** `/student/my-fees`

Track your fees by type across all courses.

**What you can see:**

- Fee breakdown by template (tuition, materials, registration, etc.)
- Payment status per fee
- Outstanding balance

---

### Fee Catalog

**Route:** `/student/fee-catalog`

View your school's fee catalog to understand the cost structure.

**What you can see:**

- All fee templates defined by the school
- Fee amounts and categories
- Recurring vs. one-time fees

---

### Settings

**Route:** `/student/settings`

Manage your profile.

| Field | Editable | Description |
|-------|----------|-------------|
| First Name | Yes | Your first name |
| Last Name | Yes | Your last name |
| Email | Yes | Login email |
| Phone | Yes | Contact number |
| Profile Picture | Yes | Your avatar |
| Password | Yes | Change password |
| CNIE | Yes | National ID number |
| Birth Date | Yes | Date of birth |
| Level | No (read-only) | Your language level (set by admin) |
| Gender | No (read-only) | Your gender (set by admin) |

---

## Key Workflows

### Enrollment Flow (End-to-End)

This is the complete journey from finding a course to getting access.

```
┌─────────────────────────────────────────────────────────────────┐
│                  ENROLLMENT FLOW — STEP BY STEP                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Browse Courses                                         │
│  ├─ Go to /student/enroll                                       │
│  ├─ Browse available courses                                    │
│  └─ Courses are filtered by your level requirement              │
│                                                                 │
│  STEP 2: Request Enrollment                                     │
│  ├─ Click "Enroll" on the course                                │
│  ├─ System checks your level matches Required Level             │
│  ├─ Enrollment created → status: PENDING_APPROVAL               │
│  └─ Admin receives notification                                 │
│                                                                 │
│  STEP 3: Wait for Approval                                      │
│  ├─ Enrollment shows in My Courses as "Pending Approval"        │
│  ├─ Admin reviews your request                                  │
│  └─ You receive a notification when approved or rejected        │
│                                                                 │
│  STEP 4: Payment (after approval)                               │
│  ├─ If APPROVED → invoice is auto-generated                     │
│  ├─ You see a "Pay" button on the course                        │
│  ├─ Choose your payment method:                                 │
│  │   ├─ CASH (pay at school)                                    │
│  │   ├─ BANK TRANSFER (transfer to school account)              │
│  │   └─ STRIPE (pay online with card)                           │
│  └─ See "Payment Flow" below for details                        │
│                                                                 │
│  STEP 5: Access Granted                                         │
│  ├─ Once payment is confirmed → status: IN_PROGRESS             │
│  ├─ Full course access unlocked:                                │
│  │   ├─ View upcoming sessions                                  │
│  │   ├─ Download course materials                               │
│  │   ├─ View attendance summaries                               │
│  │   └─ Track your progress                                     │
│  └─ Enrollment visible in My Courses as "In Progress"           │
│                                                                 │
│  STEP 6: Course Completion                                      │
│  ├─ Attend sessions, study materials                            │
│  ├─ Teacher/Admin grades you:                                   │
│  │   ├─ PASSED → Certificate auto-generated (PDF)               │
│  │   └─ FAILED → No certificate                                 │
│  └─ Certificate available in /student/certifications            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Payment Flow

After your enrollment is approved, here's how to pay:

#### Option A: Cash Payment

```
1. Course shows as "Approved" with a "Pay" button
2. Select "CASH" as payment method
3. Go to the school and pay at the reception
4. The School Admin records your payment in their system
5. Your invoice → PAID, enrollment → IN_PROGRESS
6. You receive a notification confirming payment
```

#### Option B: Bank Transfer

```
1. Select "BANK TRANSFER" as payment method
2. Transfer the course fee to the school's bank account
3. Upload your transfer receipt (if applicable)
4. Wait for the School Admin to verify and confirm
5. Your invoice → PAID, enrollment → IN_PROGRESS
6. You receive a notification confirming payment
```

#### Option C: Stripe (Online Payment)

```
1. Select "STRIPE" as payment method
2. You are redirected to a secure Stripe Checkout page
3. Pay using:
   ├─ Credit/Debit Card
   ├─ Apple Pay
   └─ Google Pay
4. On successful payment:
   ├─ Automatic confirmation (no admin action needed)
   ├─ Invoice → PAID
   ├─ Enrollment → IN_PROGRESS
   └─ Redirect back to the app with confirmation
5. On failed payment:
   ├─ Redirected back to the app
   ├─ Invoice stays UNPAID
   └─ You can retry payment
```

### Downloading Course Materials

```
1. Navigate to /student/course-detail/:id
2. Go to the "Course Materials" section
3. Materials are uploaded by your teacher (PDFs, Videos)
4. Click "Download" on any material to save it
```

### Downloading Certificates

```
1. Complete a course (attend sessions, study materials)
2. Teacher/Admin marks your enrollment as PASSED
3. Certificate is auto-generated (PDF) with:
   ├─ Your name
   ├─ Course name & language
   ├─ Level achieved
   ├─ Issue date
   └─ Digital signature
4. Navigate to /student/certifications
5. Find your certificate → Click "Download PDF"
```

---

## Navigation Reference

| Sidebar Label (FR) | Route | Description |
|--------------------|-------|-------------|
| Mes Cours | `/student/my-courses` | All enrolled courses |
| (Course Detail) | `/student/course-detail/:id` | Single course view |
| S'inscrire | `/student/enroll` | Browse & request enrollment |
| Certificats | `/student/certifications` | Earned certificates |
| Factures | `/student/invoices` | Invoice list |
| (Invoice Detail) | `/student/invoices/:id` | Single invoice view |
| Mes frais | `/student/my-fees` | Fee tracking |
| Catalogue des frais | `/student/fee-catalog` | School fee catalog |
| Paramètres | `/student/settings` | Profile management |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| My active courses | GET | `/api/v1/student/courses/active` |
| My enrollments | GET | `/api/v1/student/enrollments` |
| Request enrollment | POST | `/api/v1/student/enrollments/request` |
| My billings | GET | `/api/v1/student/billings` |
| Select payment method | POST | `/api/v1/student/billings/{billingId}/select-method` |
| My invoices | GET | `/api/v1/students/me/invoices` |
| Invoice detail | GET | `/api/v1/students/me/invoices/{invoiceId}` |
| My certifications | GET | `/api/v1/student/certifications` |
| Download certificate | GET | `/api/v1/student/certifications/{id}/download` |
| Attendance summary | GET | `/api/v1/student/attendance/my-summary` |
| Per-course attendance | GET | `/api/v1/student/attendance/my-summary/courses` |
| Course materials | GET | `/api/v1/courses/{courseId}/materials` |
| Download material | GET | `/api/v1/courses/{courseId}/materials/{id}/download` |
| My fees | GET | `/api/v1/student/fees` |
| My profile | GET | `/api/v1/students/me` |
| Update profile | PATCH | `/api/v1/students/me` |

---

## Language Levels Reference

Langly uses the European language proficiency framework:

| Level | Description |
|-------|-------------|
| A0 | Beginner (no prior knowledge) |
| A1 | Elementary |
| A2 | Pre-Intermediate |
| B1 | Intermediate |
| B2 | Upper-Intermediate |
| C1 | Advanced |
| C2 | Mastery / Proficient |

Your level is set by the School Admin and determines which courses you can enroll in.
