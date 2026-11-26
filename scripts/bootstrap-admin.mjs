import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2]?.trim().toLowerCase();

if (!supabaseUrl || !secretKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env before running this command.",
  );
  process.exit(1);
}

if (!email) {
  console.error("Usage: npm run bootstrap:admin -- <existing-user-email>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

let userToPromote = null;
let page = 1;
const perPage = 1000;

while (!userToPromote) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

  if (error) {
    console.error("Could not list Supabase Auth users:", error.message);
    process.exit(1);
  }

  userToPromote = data.users.find(
    (user) => user.email?.toLowerCase() === email,
  );

  if (data.users.length < perPage) {
    break;
  }

  page += 1;
}

if (!userToPromote) {
  console.error("No Supabase Auth user was found for that email.");
  process.exit(1);
}

const currentRole = userToPromote.app_metadata?.role;

if (currentRole && currentRole !== "admin") {
  console.error(
    'This account already has the role "' + currentRole + '". No role was changed.',
  );
  process.exit(1);
}

if (currentRole === "admin") {
  console.log("This account is already an administrator.");
  process.exit(0);
}

const { error } = await supabase.auth.admin.updateUserById(userToPromote.id, {
  app_metadata: {
    ...userToPromote.app_metadata,
    role: "admin",
  },
});

if (error) {
  console.error("Could not assign the administrator role:", error.message);
  process.exit(1);
}

console.log("Administrator role assigned. Sign out and sign in again to refresh the session.");

