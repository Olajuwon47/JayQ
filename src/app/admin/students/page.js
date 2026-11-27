import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import AuthLoading from "@/components/auth-loading";
import CreateStudentForm from "./create-student-form";
import StudentStatusControl from "./student-status-control";
import StudentProfileEditor from "./student-profile-editor";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Student accounts" };

export default function AdminStudentsPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <Link className="login-back" href="/admin/dashboard"><ArrowLeft size={15} /> Administrator dashboard</Link>
      </div>
      <section className="students-shell">
        <p className="section-kicker">ADMINISTRATOR WORKSPACE</p>
        <h1>Student accounts</h1>
        <p className="students-description">Create student accounts and view their profile status.</p>
        <section className="student-create-section" aria-labelledby="create-student-heading">
          <h2 id="create-student-heading">Create a student account</h2>
          <CreateStudentForm />
        </section>
        <Suspense fallback={<AuthLoading message="Loading student accounts..." />}>
          <StudentTable />
        </Suspense>
      </section>
      <footer className="login-footer">JayQ - Clear assessments. Confident progress.</footer>
    </main>
  );
}

async function StudentTable() {
  await connection();
  const supabase = await createClient();
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, student_id, active")
    .order("full_name");

  if (profilesError) {
    return (
      <div className="login-notice student-storage-notice">
        Student profile storage is not ready. Apply the profiles migration, then reload this page.
      </div>
    );
  }

  const admin = createAdminClient();
  const authUsers = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });

    if (error) {
      return (
        <div className="login-notice student-storage-notice">
          Student account details could not be loaded. Check the server configuration.
        </div>
      );
    }

    authUsers.push(...data.users);

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  const emailById = new Map(
    authUsers
      .filter((user) => user.app_metadata?.role === "student")
      .map((user) => [user.id, user.email || ""]),
  );

  const studentProfiles = profiles.filter((profile) => emailById.has(profile.id));

  if (studentProfiles.length === 0) {
    return <div className="students-empty">No student accounts yet.</div>;
  }

  return (
    <div className="students-table-wrap">
      <table className="students-table">
        <thead>
          <tr><th>Student</th><th>Email</th><th>Student ID</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {studentProfiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.full_name}</td>
              <td>{emailById.get(profile.id)}</td>
              <td>{profile.student_id}</td>
              <td><span className={profile.active ? "student-status is-active" : "student-status"}>{profile.active ? "Active" : "Inactive"}</span></td><td><div className="student-row-actions"><StudentStatusControl studentId={profile.id} active={profile.active} /><StudentProfileEditor accountId={profile.id} fullName={profile.full_name} studentId={profile.student_id} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}