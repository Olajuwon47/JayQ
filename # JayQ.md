# JayQ
## Product & Engineering Specification
**Project status:** Initial specification  
**Development approach:** Local development, starting from scratch  
**Presentation target:** Saturday, 28 November 2026

---

## 1. Product Overview

**Product name:** JayQ  
**Product type:** Online Examination and Assessment Platform

JayQ is a platform where administrators create and manage timed examinations, while students take examinations under defined rules, receive their results and share their achievements.

## 2. Technology Stack

| Area | Technology |
|---|---|
| Frontend | Next.js |
| Language | JavaScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Typography | Manrope |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| AI integration | Groq API |
| Webcam video storage | Cloudflare Stream |
| Deployment | Vercel |
| Source control | GitHub |

The application will initially be developed locally before being pushed to GitHub and deployed.

## 3. Visual Identity

- Main background: White
- Primary accent: Lime
- Dark accent: Deep green
- Font: Manrope
- Overall appearance: Modern, clean and polished.

Suggested colour values:

| Colour | Hex |
|---|---|
| White | #FFFFFF |
| Lime | #A3E635 |
| Deep green | #14532D |

## 4. User Roles and Permissions

### 4.1 Administrators

Administrators can:

- Create additional administrator accounts.
- Create student accounts.
- View and edit student information.
- Deactivate and reactivate student accounts.
- Reset student passwords.
- Create and manage quizzes.
- Add and edit examination questions.
- Assign marks to questions.
- Set quiz pass marks.
- Schedule quiz opening dates and times.
- Assign quizzes to individual students or groups.
- Review examination results.
- Access stored webcam recordings for review.

Only administrators can create and manage quizzes.

### 4.2 Students

Students can:

- Log in using administrator-created accounts.
- View assigned quizzes.
- View quiz details and countdowns.
- Take examinations.
- Navigate between questions.
- Change answers before submission.
- View their own scores and results.
- View correct answers after the quiz closes.
- Share their pass/fail achievement.
- Change their passwords.

Student profile information:

- Full name
- Email address
- Student ID

## 5. Quiz Management

Each quiz will have the following configuration:

| Setting | Requirement |
|---|---|
| Questions per quiz | 10 |
| Multiple Choice | 6 |
| True or False | 4 |
| Time limit | 15 minutes |
| Availability period | 24 hours |
| Attempt limit | One submitted attempt |
| Question marks | Individually assigned by administrator |
| Pass mark | Set by administrator |
| Opening time | Scheduled by administrator |

### 5.1 Quiz Scheduling

The administrator selects a scheduled opening date and time.

- Before opening, students see quiz details, the scheduled start time and a countdown.
- Students cannot start before the scheduled opening time.
- At the scheduled time, the quiz becomes available to assigned students.
- The quiz closes automatically after 24 hours.
- Students cannot start a quiz after it closes.

### 5.2 Question Management

- Administrators can create Multiple Choice and True or False questions.
- Administrators assign marks to each question.
- Students can change selected answers before submission.
- Each answer is automatically saved when selected or changed.
- Students can navigate using Previous, Next and a question-number panel.
- Unanswered questions are clearly identified.
- Students can submit without answering every question.

## 6. Examination Rules

| Rule | Agreed behaviour |
|---|---|
| Attempts | One submitted attempt per student per quiz |
| Abandoned attempt | Does not consume the attempt |
| Timer expires | Automatically submit saved answers |
| Final submission | Confirmation required |
| Submission confirmed | Cannot be reversed |
| Unanswered questions | Receive zero marks |
| Scoring | Calculated on the server |
| Correct answers | Hidden until the quiz closes |
| Score | Available immediately after submission |
| Results | Private to each student |

### 6.1 Submission Confirmation

Before submitting:

- Display the number of unanswered questions.
- Allow the student to return and review answers.
- Require confirmation before final submission.
- Once confirmed, the attempt is consumed.

### 6.2 Tab-Switch Monitoring

Every tab-switch incident is recorded.

1. First incident: Display Warning 1.
2. Second incident: Display Warning 2.
3. Third incident: Display Warning 3 and automatically submit saved answers.

The third incident triggers automatic submission.

### 6.3 Internet Connection Interruption

- Pause the examination timer when the student disconnects.
- Resume the timer after reconnection.
- Preserve saved answers.
- Use reliable server-side connection tracking to prevent timer manipulation.

## 7. Webcam Monitoring and Recording

JayQ will include basic webcam monitoring with recording.

Agreed behaviour:

- Students must grant webcam permission before starting.
- Students must complete a camera check.
- The webcam remains active during the examination.
- Webcam footage is recorded and stored.
- Administrators can access recordings for later review.
- Webcam disconnection pauses the examination timer.
- Students cannot continue answering while the camera is disconnected.
- The examination resumes when the webcam reconnects.
- Webcam interruptions are recorded.

### Privacy and Security Requirements

- Obtain student consent before recording.
- Store video securely.
- Restrict recording access to authorised administrators.
- Establish a video retention policy.
- Protect recordings against unauthorised access.

Not included in the initial monitoring scope:

- AI facial recognition.
- Automated face or gaze detection.
- Multiple-person detection.
- Live administrator supervision.

## 8. Results and Share Cards

### 8.1 Student Results

Students can see:

- Their score.
- Whether they passed or failed.
- Correct answers after the overall quiz closes.

Students cannot see other students' scores.

### 8.2 Share Card

When a student chooses to share their result, the card displays:

- Student's name.
- Pass or fail status.

The actual score does not appear on the share card.

The share card link must be accessible to anyone without requiring sign-in.

### 8.3 After a Quiz Closes

- Students who submitted can view their scores and correct answers.
- Students who did not submit cannot start the quiz.
- The quiz displays its closed status.

## 9. Student Groups and Quiz Assignments

Administrators can:

- Create student groups.
- Give each group a name.
- Add students.
- Remove students.
- Assign quizzes to groups.
- Assign quizzes to individual students.

**Group membership rule:** A student can belong to only one group at a time.

Students can only access quizzes assigned to them, provided their account is active and the quiz is available.

### 9.1 Deactivated Accounts

- Deactivated students cannot start new quizzes.
- They can still log in to view previously submitted results.
- They cannot participate in new examinations.

### 9.2 Password Management

- Students can change their own passwords.
- Administrators can reset student passwords.

## 10. Groq AI Integration

Groq will be an additional service, not the core examination engine.

Intended initial uses:

- Generate draft examination questions.
- Generate answer explanations.
- Assist administrators when preparing quizzes.

AI-generated questions must be reviewed by an administrator before publication.

Groq will not calculate official examination scores. Scoring will be handled by the server.

The Groq API key must remain on the server and must never be exposed in frontend code.

## 11. Initial Demonstration Data

The initial project brief specifies:

- 2 invented quizzes.
- 10 questions per quiz.
- 15 invented student accounts.
- All 15 students attempt both quizzes.

This data will be used to test the examination process and demonstrate the application.

## 12. Original Requirements Preserved

| Requirement | Description |
|---|---|
| R1 | Fixed number of questions and a time limit. |
| R2 | One attempt per person per quiz. |
| R3 | Answers sent after time is up are refused. |
| R4 | The score is worked out on the server, never trusted from the browser. |
| R5 | Correct answers stay hidden until the quiz closes. |
| R6 | The share card link opens for someone who is not signed in. |
| S1 | Detect and log tab switching during the quiz. |
| S2 | A score card image people can post. |

### Original Completion Checks

- A test shows a second attempt and a late submit are both refused with a clear sentence.
- The share card opens in a private window.

The tab-switch requirement has been expanded to include three warnings followed by automatic submission.

## 13. Proposed Project Structure

```text
jayq/
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── quizzes/
│   │   │   ├── students/
│   │   │   ├── groups/
│   │   │   ├── administrators/
│   │   │   └── results/
│   │   │
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   ├── quizzes/
│   │   │   ├── examination/
│   │   │   ├── results/
│   │   │   └── profile/
│   │   │
│   │   ├── share/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── admin/
│   │   ├── student/
│   │   ├── examination/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── groq/
│   │   ├── validation/
│   │   └── utils/
│   │
│   └── styles/
│
├── .env.local
├── components.json
├── jsconfig.json
├── package.json
└── README.md
```

This is a proposed starting structure and can be adjusted during implementation.

## 14. Implementation Roadmap

### Phase 1: Project Foundation

- Create Next.js project with JavaScript.
- Install Tailwind CSS and shadcn/ui.
- Configure Manrope and colour tokens.
- Connect Supabase.

### Phase 2: Authentication and Access

- Administrator authentication.
- Student authentication.
- Role-based access control.
- Student account management.

### Phase 3: Quiz Management

- Create and edit quizzes.
- Create questions and assign marks.
- Set pass marks and schedules.
- Assign quizzes to students and groups.

### Phase 4: Examination Engine

- Quiz availability and countdown.
- 15-minute examination timer.
- Automatic answer saving and navigation.
- Tab-switch detection and enforcement.
- Submission and automatic marking.

### Phase 5: Results and Security

- Private results and pass/fail.
- Correct answers after closure.
- Public share cards.
- Secure webcam recording and review.

### Phase 6: Presentation Preparation

- Create demonstration data.
- Test the complete student journey.
- Test administrator workflows.
- Prepare the project presentation.

## 15. Outstanding Decisions

The following details still need to be settled:

1. Webcam recording retention period and consent process.
2. What happens if a student loses internet and webcam connectivity simultaneously.
3. Whether administrators can change a quiz after it has been published or attempted.
4. Whether a student can be reassigned to a different group while quizzes are active.
5. How administrators bootstrap the first administrator account.
6. Exact database schema, security policies and automatic submission implementation.

These details must be resolved before the affected features are implemented. They should not be guessed.

---

## 16. Development Priority

The first priority is a working examination platform.

Build the examination engine before webcam recording or Groq integration.

The essential demonstration should show:

1. Administrator login.
2. Quiz creation.
3. Student account creation and quiz assignment.
4. Student taking a timed examination.
5. Automatic submission and marking.
6. Results and pass/fail status.
7. Shareable result card.

Webcam recording, group management and AI question generation remain in the approved product scope, but should not delay the core examination workflow.

**JayQ's central objective:** Deliver a reliable online examination experience with controlled access, timed assessments, server-side scoring and shareable results.