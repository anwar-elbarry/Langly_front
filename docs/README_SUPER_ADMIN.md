# Super Admin Dashboard — User Guide

> **Role:** `SUPER_ADMIN`  
> **Access Level:** Platform-wide administration  
> **Login URL:** `/login`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard Pages](#dashboard-pages)
   - [Overview](#overview-page)
   - [Schools Management](#schools-management)
   - [Users Management](#users-management)
   - [Super Admins](#super-admins)
   - [Subscriptions](#subscriptions)
   - [Settings](#settings)
4. [Key Workflows](#key-workflows)
   - [Creating a New School](#creating-a-new-school)
   - [Managing Users Across Schools](#managing-users-across-schools)
   - [Managing School Subscriptions](#managing-school-subscriptions)

---

## Overview

The **Super Admin** is the highest-level role in Langly. You have full control over the entire platform — managing schools, users, subscriptions, and system-wide settings. You do **not** interact directly with courses, sessions, billing, or enrollments — those are managed at the school level by School Admins.

**Your responsibilities:**

- Create and manage schools
- Manage all users across schools
- Manage Super Admin accounts
- Configure and track school subscriptions
- Monitor platform-wide metrics

---

## Getting Started

1. Navigate to the login page (`/login`).
2. Enter your Super Admin credentials (email & password).
3. Upon login, you are redirected to `/superAdmin/overview`.
4. Use the **sidebar navigation** (labels in French) to access all management pages.

---

## Dashboard Pages

### Overview Page

**Route:** `/superAdmin/overview`

Your main dashboard showing platform-wide statistics:

| Metric | Description |
|--------|-------------|
| Total Schools | Number of registered schools on the platform |
| Total Users | All users across all schools |
| Revenue | Platform-wide revenue metrics |
| System Health | Status indicators for platform services |

Use this page to get a quick snapshot of the platform's state at a glance.

---

### Schools Management

**Route:** `/superAdmin/schools`

Manage all schools registered on the Langly platform.

**What you can do:**

- **View** a list of all schools with their status
- **Create** a new school (name, logo, city, country, address)
- **Edit** an existing school's details
- **Delete** a school
- **Manage school status:** `ACTIVE`, `INACTIVE`, `SUSPENDED`

**School fields:**

| Field | Description |
|-------|-------------|
| Name | School display name |
| Logo | School branding image |
| City / Country | School location |
| Address | Full address |
| Status | ACTIVE / INACTIVE / SUSPENDED |

---

### Users Management

**Route:** `/superAdmin/users`

View and manage **all users** across every school on the platform.

**What you can do:**

- Browse/search/filter users by role, school, or status
- View individual user profiles
- Create new users (and assign them to a school and role)
- Edit user details (name, email, phone, status)
- Change user passwords
- Activate or suspend users

**User fields:**

| Field | Description |
|-------|-------------|
| First Name / Last Name | User's full name |
| Email | Unique login identifier |
| Phone Number | Contact number (unique) |
| Profile | Profile picture |
| Status | ACTIVE / SUSPENDED |
| Role | SUPER_ADMIN / SCHOOL_ADMIN / TEACHER / STUDENT |
| School | Assigned school (if applicable) |

---

### Super Admins

**Route:** `/superAdmin/super-admins`

Dedicated page for managing Super Admin accounts specifically.

**What you can do:**

- **View** all Super Admin users
- **Create** a new Super Admin
- **Edit** Super Admin details
- **Delete** Super Admin accounts

---

### Subscriptions

**Route:** `/superAdmin/subscriptions`

Manage school subscription plans and billing cycles.

**What you can do:**

- **Create** a subscription for a school
- **View** all subscriptions with status
- **Update** subscription terms (amount, billing cycle, currency)
- **Update payment status** (PAID / UNPAID / OVERDUE)
- **View** subscription history and renewal dates

**Subscription fields:**

| Field | Description |
|-------|-------------|
| School | Associated school |
| Amount | Subscription fee |
| Currency | Payment currency (default: MAD) |
| Billing Cycle | Monthly / Quarterly / Yearly |
| Current Period | Start → End dates |
| Next Payment Date | When the next payment is due |
| Status | Payment status |

---

### Settings

**Route:** `/superAdmin/settings`

Manage your profile, change password, and configure platform-wide default settings.

---

## Key Workflows

### Creating a New School

```
1. Navigate to /superAdmin/schools
2. Click "Create School"
3. Fill in:
   - School Name
   - City, Country, Address
   - Upload Logo (optional)
4. Save → School is created with ACTIVE status
5. Navigate to /superAdmin/users → Create a SCHOOL_ADMIN user for the new school
6. Optionally create a subscription for the school (/superAdmin/subscriptions)
7. The School Admin can now log in and manage their school
```

### Managing Users Across Schools

```
1. Navigate to /superAdmin/users
2. Use filters to find users by role, school, or status
3. Click on a user to view/edit their profile
4. To create a new user:
   a. Click "Create User"
   b. Select the target school
   c. Assign a role (SCHOOL_ADMIN, TEACHER, STUDENT)
   d. Fill in user details (name, email, phone, password)
   e. Save → User receives credentials
5. To suspend/activate a user:
   a. Click on the user
   b. Toggle their status (ACTIVE ↔ SUSPENDED)
```

### Managing School Subscriptions

```
1. Navigate to /superAdmin/subscriptions
2. To create a subscription:
   a. Select a school
   b. Set amount, currency (MAD), billing cycle
   c. Define period start/end dates
   d. Save → Subscription created
3. To track payments:
   a. View subscription list → check payment status
   b. Update status: PAID / UNPAID / OVERDUE
4. To update terms:
   a. Click on a subscription
   b. Modify amount, cycle, or dates
   c. Save changes
```

---

## Navigation Reference

| Sidebar Label (FR) | Route | Description |
|--------------------|-------|-------------|
| Vue d'ensemble | `/superAdmin/overview` | Platform dashboard |
| Écoles | `/superAdmin/schools` | School CRUD |
| Utilisateurs | `/superAdmin/users` | All users management |
| Super Admins | `/superAdmin/super-admins` | Super admin accounts |
| Abonnements | `/superAdmin/subscriptions` | School subscription plans |
| Paramètres | `/superAdmin/settings` | Profile & platform settings |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| List all schools | GET | `/api/v1/schools` |
| Create school | POST | `/api/v1/schools` |
| Update school | PUT | `/api/v1/schools/{id}` |
| Delete school | DELETE | `/api/v1/schools/{id}` |
| List all users | GET | `/api/v1/users` |
| Create user | POST | `/api/v1/users` |
| Update user | PUT | `/api/v1/users/{id}` |
| Activate/Suspend user | PATCH | `/api/v1/users/{id}/status` |
| Update password | PATCH | `/api/v1/users/{id}/password` |
| List super admins | GET | `/api/v1/super-admins` |
| Create super admin | POST | `/api/v1/super-admins` |
| Update super admin | PUT | `/api/v1/super-admins/{id}` |
| Delete super admin | DELETE | `/api/v1/super-admins/{id}` |
| List subscriptions | GET | `/api/v1/subscriptions` |
| Create subscription | POST | `/api/v1/subscriptions` |
| Get subscription | GET | `/api/v1/subscriptions/{id}` |
| Get by school | GET | `/api/v1/subscriptions/school/{schoolId}` |
| Update subscription | PUT | `/api/v1/subscriptions/{id}` |
| Update payment status | PATCH | `/api/v1/subscriptions/{id}/payment-status` |
