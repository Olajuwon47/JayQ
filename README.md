# JayQ

JayQ is an online examination and assessment platform for administrators and students.

## Getting started

Install dependencies with npm install and start the local development server with npm run dev.

Open http://localhost:3000 to view the public JayQ homepage. Sign-in is at /login.

## Project foundation

- Next.js App Router with JavaScript
- Tailwind CSS and shadcn/ui
- Manrope typography
- JayQ palette: white, lime (#A3E635), and deep green (#14532D)
- Supabase Auth with cookie-based sessions

## First administrator setup

1. In the project-root .env file, add a Supabase secret key using SUPABASE_SECRET_KEY=... . The legacy SUPABASE_SERVICE_ROLE_KEY name is also accepted.
2. Keep this key server-side. Do not prefix it with NEXT_PUBLIC_ or commit it.
3. Run npm run bootstrap:admin -- your-admin-email@example.com using the email of the existing Supabase Auth account selected as the first administrator.
4. Sign out of JayQ and sign in again so the refreshed session receives the administrator role.

The bootstrap command assigns the role in Supabase Auth app_metadata. It refuses to replace an existing non-admin role.

## Current authentication scope

Email and password sign-in is enabled. The account page redirects administrators and students to separate protected workspace placeholders. Administrator account creation, student management, and the final database security policies are later implementation steps.

See the JayQ guide in this workspace for the product specification and roadmap.
