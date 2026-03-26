# School Admin Dashboard — User Guide

> **Role:** `SCHOOL_ADMIN`  
> **Access Level:** School-level administration  
> **Login URL:** `/login`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard Pages](#dashboard-pages)
   - [Home](#home--overview)
   - [Team Management](#team-management)
   - [Courses](#courses-management)
   - [Students](#students-management)
   - [Enrollments](#enrollments-management)
   - [Invoices & Billing](#invoices--billing)
   - [Fee Payments](#fee-payments)
   - [Discounts](#discounts)
   - [Fee Templates](#fee-templates)
   - [Billing Settings](#billing-settings)
   - [Subscription](#subscription)
   - [Alerts](#alerts--notifications)
   - [Settings](#school-settings)
4. [Key Workflows](#key-workflows)
   - [Creating a Course](#creating-a-course)
   - [Enrollment Approval Flow](#enrollment-approval-flow)
   - [Billing & Payment Confirmation](#billing--payment-confirmation)
   - [Stripe Payment Flow](#stripe-payment-flow)
   - [Managing Students](#managing-students)
   - [Grading & Certifications](#grading--certifications)
   - [Configuring Installment Plans](#configuring-installment-plans)

---

## Overview

The **School Admin** is the central management role for a school. You control the entire lifecycle of courses, students, enrollments, billing, and teacher assignments within your school. This is the most comprehensive role in terms of daily operations.

**Your responsibilities:**

- Create and manage courses
- Manage teachers and staff
- Approve/reject student enrollment requests
- Handle billing, invoicing, and payment confirmations
- Configure fee templates, discounts, and installment plans
- Monitor school performance and alerts
- View school subscription status

---

## Getting Started

1. Navigate to `/login` and enter your School Admin credentials.
2. Upon login, you are redirected to `/schoolAdmin/home`.
3. The **sidebar** (labels in French) provides access to all management sections.
4. Check the **Alertes** section regularly for pending enrollment requests and payment notifications.

---

## Dashboard Pages

### Home / Overview

**Route:** `/schoolAdmin/home`

Your main dashboard showing school-level statistics:

| Metric | Description |
|--------|-------------|
| Active Courses | Number of currently running courses |
| Enrolled Students | Total students with active enrollments |
| Pending Payments | Billings awaiting payment or confirmation |
| Upcoming Sessions | Sessions scheduled in the near future |

**Quick Actions:**
- Create a new course
- Add a new student
- View pending payments

---

### Team Management

**Route:** `/schoolAdmin/team`

Manage teachers and staff members in your school.

**What you can do:**

- **View** all teachers/staff assigned to your school
- **Create** a new team member (fills in name, email, phone, role)
- **Edit** team member details
- **Delete** team members
- **Assign roles:** `TEACHER` or `SCHOOL_ADMIN`
- **View** which courses are assigned to each teacher

---

### Courses Management

**Route:** `/schoolAdmin/courses`  
**Course Detail:** `/schoolAdmin/courses/:id`

Full control over your school's course catalog.

**What you can do:**

- **View** all courses in your school (filterable by language/level)
- **Create** a new course
- **Edit** course details
- **Delete** a course
- **View** enrolled students per course
- **View** sessions scheduled per course

**Course fields:**

| Field | Description |
|-------|-------------|
| Name | Course display name |
| Code | Unique course code |
| Language | Language being taught |
| Required Level | Minimum student level to enroll (A0–C2) |
| Target Level | Level student will achieve upon completion |
| Start Date / End Date | Course duration |
| Capacity | Maximum number of students |
| Price | Course enrollment fee |
| Sessions Per Week | How many sessions per week |
| Minutes Per Session | Duration of each session |
| Teacher | Assigned instructor |

---

### Students Management

**Route:** `/schoolAdmin/students`  
**Student Detail:** `/schoolAdmin/students/:id`

Manage all students in your school.

**What you can do:**

- **Browse** the student list with search/filter
- **Create** a new student (sends email invitation)
- **View** student profile (click to open detail page)
- **View incomplete profiles** — students with missing data (CNIE, birthDate, etc.) via a dedicated filter
- **Edit** student information:
  - First name, last name, email, phone
  - Birth date, CNIE (national ID)
  - Level (A0–C2) — admin can update
  - Gender (MALE/FEMALE) — admin can set
  - Profile picture
- **View** the student's enrollment history
- **View** the student's billing history

> The system tracks `missingFields[]` for each student profile to highlight incomplete data.

---

### Enrollments Management

**Route:** `/schoolAdmin/enrollments`

The central hub for managing enrollment requests and enrollment lifecycle.

**What you can see:**

- **Pending Approval** tab: New enrollment requests from students
- **All Enrollments** tab: Full list with status filters

**Enrollment Statuses:**

| Status | Meaning |
|--------|---------|
| `PENDING_APPROVAL` | Student requested — needs your review |
| `APPROVED` | You approved — invoice created, awaiting payment |
| `REJECTED` | You rejected the request |
| `IN_PROGRESS` | Payment confirmed — student actively enrolled |
| `PASSED` | Student completed successfully |
| `FAILED` | Student did not pass |
| `WITHDRAWN` | Student withdrew from course |
| `TRANSFERRED` | Student transferred to another course |

**What you can do:**

- **Approve** an enrollment → Automatically generates an invoice
- **Reject** an enrollment → Student is notified
- **Update status** → Mark as PASSED/FAILED/WITHDRAWN after course completion
- **View** enrollment details including linked billing/invoice information

---

### Invoices & Billing

**Route:** `/schoolAdmin/invoices`  
**Invoice Detail:** `/schoolAdmin/invoices/:id`

Manage all invoices for your school using the full billing engine.

**What you can see:**

- List of all invoices with status badges (color-coded)
- Filter by: UNPAID, PARTIALLY_PAID, PAID

**Invoice Statuses:**

| Status | Color | Meaning |
|--------|-------|---------|
| `PAID` | Green | Fully paid |
| `PARTIALLY_PAID` | Blue | Partial payments received (installment plan) |
| `UNPAID` | Red | No payment yet |

**Payment Methods:**

| Method | Admin Action Required |
|--------|-----------------------|
| `CASH` | Student pays at school → **Admin must confirm** |
| `BANK_TRANSFER` | Student transfers funds → **Admin must verify & confirm** |
| `STRIPE` | Online payment → **Auto-confirmed** via Stripe webhook |

**What you can do:**

- **Record payments** against invoices (CASH / BANK_TRANSFER)
- **Create installment plans** — split invoices into 2 or 3 scheduled payments
- **View** payment history (all payment attempts for each invoice)
- **View** payment schedules for installment plans
- **Generate/download** invoice PDFs

---

### Fee Payments

**Route:** `/schoolAdmin/fee-payments`

Track and manage all payment records across the school.

**What you can do:**

- **View** all fee payment records
- **Record** new payments (CASH, BANK_TRANSFER confirmations)
- **Filter** by payment status and method
- **Track** payment history per student

---

### Discounts

**Route:** `/schoolAdmin/discounts`

Manage discounts and scholarships.

**What you can do:**

- **Create** discount templates with type: `PERCENTAGE` or `FIXED_AMOUNT`
- **Edit** existing discounts
- **Delete** discounts
- **Apply** discounts during enrollment approval
- **Track** discount usage

---

### Fee Templates

**Route:** `/schoolAdmin/fee-templates`

Define reusable fee structures for your school.

**What you can do:**

- **Create** fee templates (tuition, material fees, registration fees, exam fees)
- **Edit** fee template amounts and categories
- **Delete** unused templates
- **Configure** recurring vs. one-time fees

---

### Billing Settings

**Route:** `/schoolAdmin/billing-settings`

Configure billing defaults for your school.

**What you can configure:**

- **TVA (tax) rate** — applied to invoices
- **Due dates** — payment deadline rules
- **Installment plans** — enable FULL (100%), TWO_PARTS (50/50), or THREE_PARTS (33/33/33)
- **Payment blocking rules** — prevent enrollment access for overdue accounts

---

### Subscription

**Route:** `/schoolAdmin/subscription`

View your school's platform subscription status and payment schedule.

**What you can see:**

- Current subscription plan details
- Billing cycle and next payment date
- Payment status (PAID / UNPAID / OVERDUE)
- Subscription history

---

### Alerts & Notifications

**Route:** `/schoolAdmin/alerts`

Stay on top of important events.

**Notification Types:**

| Type | Description |
|------|-------------|
| `ENROLLMENT_REQUEST` | A student has requested enrollment |
| `PAYMENT_DUE` | An invoice is approaching its due date |
| `PAYMENT_CONFIRMED` | A payment has been confirmed |
| `SYSTEM_ALERT` | System-level notification |

- View all notifications
- Mark as read/unread
- Click to navigate to the related item

---

### School Settings

**Route:** `/schoolAdmin/settings`

Manage your profile and school configuration. Includes password change.

---

## Key Workflows

### Creating a Course

```
1. Navigate to /schoolAdmin/courses
2. Click "Create Course"
3. Fill in course details:
   - Name, Code (unique identifier)
   - Language, Required Level (A0–C2), Target Level
   - Start Date, End Date
   - Capacity (max students)
   - Price
   - Sessions Per Week, Minutes Per Session
   - Assign a Teacher (from your team)
4. Save → Course is created and appears in the course list
5. Students can now see this course and request enrollment
```

### Enrollment Approval Flow

This is the most critical workflow — it drives the entire billing and course access system.

```
Step 1: Student Requests Enrollment
   └─ Student browses available courses → clicks "Enroll"
   └─ Enrollment created with status: PENDING_APPROVAL
   └─ You receive a notification

Step 2: Admin Reviews Request
   └─ Navigate to /schoolAdmin/enrollments
   └─ View pending requests
   └─ Review student details & course capacity

Step 3: Approve or Reject
   ├─ APPROVE:
   │   └─ Enrollment status → APPROVED
   │   └─ Invoice auto-generated (amount = course price, status = UNPAID)
   │   └─ Student notified → sees "Pay" button
   │
   └─ REJECT:
       └─ Enrollment status → REJECTED
       └─ Student notified of rejection

Step 4: Payment (after approval)
   └─ See "Billing & Payment Confirmation" below
```

### Billing & Payment Confirmation

```
After an enrollment is APPROVED, an invoice is generated:

┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT METHODS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CASH:                                                      │
│  ├─ Student pays at school reception                        │
│  ├─ Navigate to /schoolAdmin/invoices                       │
│  ├─ Find the invoice → Record payment                       │
│  └─ Invoice → PAID, Enrollment → IN_PROGRESS                │
│                                                             │
│  BANK TRANSFER:                                             │
│  ├─ Student transfers funds to school bank account           │
│  ├─ Verify the receipt in /schoolAdmin/invoices              │
│  ├─ Record payment                                           │
│  └─ Invoice → PAID, Enrollment → IN_PROGRESS                │
│                                                             │
│  STRIPE (Online):                                           │
│  ├─ Student selects Stripe → redirected to Stripe Checkout   │
│  ├─ Pays via card, Apple Pay, Google Pay, etc.               │
│  ├─ On success: Stripe webhook auto-confirms payment         │
│  └─ Invoice → PAID, Enrollment → IN_PROGRESS (automatic)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stripe Payment Flow

```
1. Student selects STRIPE as payment method
   └─ POST /api/v1/student/billings/{billingId}/select-method

2. Backend creates Stripe Checkout Session
   └─ Returns checkout URL to frontend

3. Student is redirected to Stripe-hosted checkout page
   └─ Pays via card, Apple Pay, Google Pay, etc.

4. On successful payment:
   └─ Stripe sends webhook → POST /api/v1/webhooks/stripe
   └─ Backend auto-confirms:
       ├─ Billing status → PAID
       ├─ Billing paidAt → current timestamp
       └─ Enrollment status → IN_PROGRESS

5. On failed payment:
   └─ Student redirected back
   └─ Billing remains PENDING
   └─ Student can retry
```

### Managing Students

```
Creating a student:
1. Navigate to /schoolAdmin/students
2. Click "Add Student"
3. Fill in: First name, Last name, Email, Phone
4. Optionally set: Birth date, CNIE, Level, Gender
5. Save → Student account created (receives login credentials via email)

Viewing incomplete profiles:
1. Navigate to /schoolAdmin/students
2. Filter by "incomplete" to see students missing required data
3. System tracks missingFields[] per student

Updating a student:
1. Click on a student in the list → opens /schoolAdmin/students/:id
2. View/edit their profile information
3. Update level, gender (admin-only fields)
4. View their enrollment history
5. View their billing/payment history
```

### Grading & Certifications

```
When a course ends:

1. Navigate to /schoolAdmin/enrollments
2. Find enrollments for the completed course
3. Update each student's status:
   ├─ PASSED → Student completed successfully
   │   └─ Triggers automatic PDF certificate generation
   │   └─ Certificate includes: name, course, language, level, date, digital signature
   │   └─ Student notified & can download certificate from /student/certifications
   │
   ├─ FAILED → Student did not pass
   │   └─ Student notified
   │
   └─ WITHDRAWN → Student withdrew early
       └─ Student notified
```

### Configuring Installment Plans

```
1. Navigate to /schoolAdmin/billing-settings
2. Enable installment plans for your school
3. Choose available plan types:
   ├─ FULL — 100% upfront payment
   ├─ TWO_PARTS — 50% / 50% split
   └─ THREE_PARTS — 33% / 33% / 33% split
4. When an enrollment is approved, the invoice can be split
   according to the selected plan
5. Payment schedules are auto-generated with due dates
6. Track partial payments in /schoolAdmin/invoices/:id
```

---

## Navigation Reference

| Sidebar Label (FR) | Route | Description |
|--------------------|-------|-------------|
| Accueil | `/schoolAdmin/home` | Dashboard overview |
| Équipe | `/schoolAdmin/team` | Teachers & staff |
| Cours | `/schoolAdmin/courses` | Course CRUD |
| Élèves | `/schoolAdmin/students` | Student management |
| Inscriptions | `/schoolAdmin/enrollments` | Enrollment requests & lifecycle |
| Factures | `/schoolAdmin/invoices` | Invoices & billing |
| Suivi des paiements | `/schoolAdmin/fee-payments` | Payment records |
| Remises | `/schoolAdmin/discounts` | Discount management |
| Catalogue de frais | `/schoolAdmin/fee-templates` | Fee configuration |
| Param. facturation | `/schoolAdmin/billing-settings` | Billing config (TVA, installments) |
| Abonnement | `/schoolAdmin/subscription` | School subscription status |
| Alertes | `/schoolAdmin/alerts` | Notifications |
| Paramètres | `/schoolAdmin/settings` | Profile & school settings |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| List school courses | GET | `/api/v1/courses/school/{schoolId}` |
| Create course | POST | `/api/v1/courses` |
| Get course detail | GET | `/api/v1/courses/{id}` |
| Update course | PUT | `/api/v1/courses/{id}` |
| Delete course | DELETE | `/api/v1/courses/{id}` |
| List school students | GET | `/api/v1/students/school/{schoolId}` |
| Incomplete profiles | GET | `/api/v1/students/school/{schoolId}/incomplete` |
| Get student detail | GET | `/api/v1/students/{id}` |
| Update student (admin) | PATCH | `/api/v1/students/{id}/admin` |
| List school enrollments | GET | `/api/v1/enrollments/school/{schoolId}` |
| Approve enrollment | PATCH | `/api/v1/enrollments/{id}/approve` |
| Reject enrollment | PATCH | `/api/v1/enrollments/{id}/reject` |
| Update enrollment status | PATCH | `/api/v1/enrollments/{id}/status` |
| List school invoices | GET | `/api/v1/schools/{schoolId}/invoices` |
| Get invoice detail | GET | `/api/v1/invoices/{id}` |
| Record payment | POST | `/api/v1/invoices/{id}/payments` |
| Get/create schedule | GET/POST | `/api/v1/invoices/{id}/schedule` |
| Pending billings | GET | `/api/v1/billings/school/{schoolId}/pending` |
| Confirm payment | PATCH | `/api/v1/billings/{id}/confirm` |
| List fee templates | GET | `/api/v1/schools/{schoolId}/fee-templates` |
| Create fee template | POST | `/api/v1/schools/{schoolId}/fee-templates` |
| Update fee template | PUT | `/api/v1/schools/{schoolId}/fee-templates/{id}` |
| Delete fee template | DELETE | `/api/v1/schools/{schoolId}/fee-templates/{id}` |
| List discounts | GET | `/api/v1/schools/{schoolId}/discounts` |
| Create discount | POST | `/api/v1/schools/{schoolId}/discounts` |
| Update discount | PUT | `/api/v1/schools/{schoolId}/discounts/{id}` |
| Delete discount | DELETE | `/api/v1/schools/{schoolId}/discounts/{id}` |
| Get billing settings | GET | `/api/v1/schools/{schoolId}/billing-settings` |
| Update billing settings | PUT | `/api/v1/schools/{schoolId}/billing-settings` |
| Get bank info | GET | `/api/v1/schools/{schoolId}/bank-info` |
| Save bank info | POST | `/api/v1/schools/{schoolId}/bank-info` |
| Create user | POST | `/api/v1/users` |
