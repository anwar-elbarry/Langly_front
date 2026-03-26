# Teacher Dashboard — User Guide

> **Role:** `TEACHER`  
> **Access Level:** Course-level instruction & management  
> **Login URL:** `/login`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard Pages](#dashboard-pages)
   - [Home](#home--overview)
   - [My Courses](#my-courses)
   - [Course Detail](#course-detail)
   - [Attendance](#attendance-tracking)
   - [Settings](#settings)
4. [Key Workflows](#key-workflows)
   - [Managing Sessions](#managing-sessions)
   - [Manual Attendance](#manual-attendance)
   - [Uploading Course Materials](#uploading-course-materials)
   - [Grading Students](#grading-students)

---

## Overview

As a **Teacher**, you manage your assigned courses — creating sessions, tracking attendance manually, uploading course materials, and grading students. You only see courses that have been assigned to you by the School Admin.

**Your responsibilities:**

- Create and manage sessions for your courses
- Track student attendance (manual marking)
- Upload course materials (PDFs, videos)
- View enrolled students and their attendance records
- Grade students when the course ends (PASSED / FAILED)

---

## Getting Started

1. Navigate to `/login` and enter your credentials.
2. Upon login, you are redirected to `/teacher/home`.
3. The **sidebar** (labels in French) shows: Accueil, Mes Cours, Paramètres.
4. Click on **Mes Cours** to see all courses assigned to you.

---

## Dashboard Pages

### Home / Overview

**Route:** `/teacher/home`

Your main dashboard showing quick stats:

| Metric | Description |
|--------|-------------|
| Total Courses | Number of courses assigned to you |
| Active Courses | Courses currently running (between start & end dates) |
| Total Students | All enrolled students across your courses |
| Upcoming Sessions | Sessions scheduled in the near future |
| Pending Grading | Enrollments awaiting grade (PASSED/FAILED) |

---

### My Courses

**Route:** `/teacher/courses`

View all courses assigned to you.

**Each course card shows:**

| Field | Description |
|-------|-------------|
| Name | Course name |
| Language | Language being taught |
| Level | Required level → Target level (e.g., A1 → A2) |
| Dates | Start date – End date |
| Capacity | Enrolled students / maximum capacity |
| Price | Course enrollment fee |

Click a course to open its detail page.

---

### Course Detail

**Route:** `/teacher/courses/:id`

The full management view for a single course. This page has multiple sections:

#### Course Info
- Course name, code, language, levels, dates, capacity, price

#### Enrolled Students
- List of all students enrolled in this course
- Each student shows: name, enrollment status, email
- Click on a student to view their details

#### Sessions
- List of all sessions for this course (past and upcoming)
- **Create** new sessions
- **Edit** existing sessions
- **Delete** sessions
- Click a session to open the attendance view

#### Course Materials
- List of uploaded materials (PDF, VIDEO)
- **Upload** new materials
- **Download** existing materials
- **Delete** materials

#### Enrollments
- View enrollment statuses for all students
- **Grade** students: mark as PASSED or FAILED

---

### Attendance Tracking

**Route:** `/teacher/attendance/:sessionId`

Manage attendance for a specific session via manual marking.

**What you see:**

- Session info (title, date, time, mode, room/meeting link)
- List of **all enrolled students** with their attendance status
- **Marked Attendance** view: Only students who have been marked
- **Full Attendance** view: All enrolled students — unmarked students show as ABSENT by default

**Attendance Statuses:**

| Status | Meaning |
|--------|---------|
| `PRESENT` | Student attended the session |
| `ABSENT` | Student did not attend |
| `LATE` | Student arrived late |
| `EXCUSED` | Student has an excused absence |

---

### Settings

**Route:** `/teacher/settings`

Manage your profile information and change your password.

---

## Key Workflows

### Managing Sessions

Sessions are the building blocks of your courses — each session represents a class meeting.

#### Creating a Session

```
1. Navigate to /teacher/courses/:id (your course detail page)
2. Go to the Sessions section
3. Click "Create Session"
4. Fill in:
   - Title (e.g., "Lesson 5 — Past Tense")
   - Description (optional: lesson overview)
   - Scheduled Date & Time
   - Duration in minutes
   - Mode:
     ├─ IN_PERSON → provide Room number
     ├─ ONLINE → provide Meeting Link (Zoom, Meet, etc.)
     └─ HYBRID → provide both Room and Meeting Link
5. Save → Session appears in the sessions list
```

#### Editing a Session

```
1. Click on a session in the session list
2. Modify any field (title, date, time, mode, room, link)
3. Save changes
```

#### Deleting a Session

```
1. Click the delete button on a session
2. Confirm deletion
```

**Session Modes:**

| Mode | Description | Required Fields |
|------|-------------|-----------------|
| `ONLINE` | Virtual only | Meeting Link |
| `IN_PERSON` | Physical only | Room |
| `HYBRID` | Both options | Meeting Link + Room |

---

### Manual Attendance

Mark attendance for each student during or after a session.

```
1. Navigate to /teacher/attendance/:sessionId
2. View the full student list (all enrolled students)
3. For each student, select their status:
   - PRESENT — attended
   - ABSENT — did not attend
   - LATE — arrived late
   - EXCUSED — legitimate absence
4. Save → Attendance records updated
```

**Attendance views:**

- **Marked Attendance:** Only students who have been marked (via manual entry)
- **Full Attendance:** All enrolled students — unmarked students show as ABSENT by default

---

### Uploading Course Materials

Share learning resources with your students.

```
1. Navigate to /teacher/courses/:id
2. Go to the Course Materials section
3. Click "Upload Material"
4. Fill in:
   - Name (e.g., "Chapter 3 — Vocabulary List")
   - Type: PDF or VIDEO
   - Select file from your computer
5. Upload → Material appears in the list
6. Students can now download this material from their course page
```

**Supported formats:**

| Type | Description |
|------|-------------|
| `PDF` | PDF documents (lessons, exercises, handouts) |
| `VIDEO` | Video resources (recorded lectures, tutorials) |

**Managing materials:**
- **Download:** Click the download button to preview/save
- **Delete:** Remove materials you no longer need

---

### Grading Students

When a course ends, you grade each student's enrollment.

```
1. Navigate to /teacher/courses/:id
2. Go to the Enrollments section
3. For each student, update their enrollment status:
   ├─ PASSED → Student completed the course successfully
   │   └─ Triggers automatic PDF certificate generation
   │   └─ Certificate includes: name, course, language, level, date, digital signature
   │   └─ Student receives notification
   │   └─ Certificate available for download at /student/certifications
   │
   └─ FAILED → Student did not pass
       └─ Student receives notification

Note: You can also mark students as WITHDRAWN if they left the course.
```

---

## Navigation Reference

| Sidebar Label (FR) | Route | Description |
|--------------------|-------|-------------|
| Accueil | `/teacher/home` | Dashboard overview & stats |
| Mes Cours | `/teacher/courses` | My assigned courses |
| (Course Detail) | `/teacher/courses/:id` | Sessions, materials, students |
| (Attendance) | `/teacher/attendance/:sessionId` | Manual attendance marking |
| Paramètres | `/teacher/settings` | Profile management |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| My courses | GET | `/api/v1/teacher/courses` |
| Dashboard stats | GET | `/api/v1/teacher/overview` |
| Create session | POST | `/api/v1/sessions` |
| View course sessions | GET | `/api/v1/sessions/course/{courseId}` |
| Upcoming sessions | GET | `/api/v1/sessions/course/{courseId}/upcoming` |
| Update session | PUT | `/api/v1/sessions/{id}` |
| Delete session | DELETE | `/api/v1/sessions/{id}` |
| View attendance | GET | `/api/v1/teacher/sessions/{sessionId}/attendance` |
| Full attendance | GET | `/api/v1/teacher/sessions/{sessionId}/attendance/full` |
| Manual mark | PUT | `/api/v1/teacher/sessions/{sessionId}/attendance` |
| Upload material | POST | `/api/v1/courses/{courseId}/materials` |
| List materials | GET | `/api/v1/courses/{courseId}/materials` |
| Download material | GET | `/api/v1/courses/{courseId}/materials/{id}/download` |
| Delete material | DELETE | `/api/v1/courses/{courseId}/materials/{id}` |
| Grade enrollment | PATCH | `/api/v1/enrollments/{id}/status` |
