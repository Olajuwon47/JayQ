# JayQ AI-for-Software-Engineering Capstone

## 1. Project repository

- Repository: [Olajuwon47/JayQ](https://github.com/Olajuwon47/JayQ)
- Local submission root: `C:\Users\User\JayQ`

## 2. Problem statement and scope

### Problem

The JayQ student access policy has a focused test file, but no standard package test command and limited coverage for malformed or unknown inputs. In an authorization-sensitive workflow, the tests should make the policy matrix explicit and ensure unexpected values fail safely.

### Selected task

Harden the student resource-access policy test suite and add a repeatable test command.

### In scope

- Add an `npm test` script.
- Add focused Node tests for:
  - Active and deactivated student access.
  - Suspended and unknown account states.
  - Unknown roles.
  - Unknown resources.
  - Missing or malformed policy context.
- Add minimal policy implementation hardening if malformed context would otherwise throw.
- Run the smallest relevant test command.

### Out of scope

- Quiz implementation.
- Database migrations or profile schema changes.
- UI redesign.
- Administrator, sign-in, or password workflow changes.

### Relevant source files

- `src/lib/supabase/student-access.mjs`
- `src/lib/supabase/student-access.test.mjs`
- `src/lib/supabase/roles.js`
- `package.json`
- `AGENTS.md`

## 3. Prompt and context used

```text
Scope: Improve test coverage for the student resource-access policy.

Read AGENTS.md and the repository rules.
Use only the existing JavaScript and Node test conventions.

Required behavior:
- Active students may access account, profile, results, and quiz-start.
- Deactivated students may access account, profile, and results.
- Deactivated students cannot start quizzes.
- Suspended or unknown states are undecided.
- Non-students and unknown roles are denied.
- Unknown resources are denied.
- Missing or malformed policy context must be denied or remain undecided
  rather than throwing.

Add:
- A test script in package.json.
- Focused Node test cases.
- Minimal implementation changes, if required.

Do not change database authorization, UI behavior, or unrelated files.
Run the smallest relevant test command and report exact evidence.
```

The AI context included:

- Repository workflow rules in `AGENTS.md`.
- Existing policy implementation in `src/lib/supabase/student-access.mjs`.
- Existing policy tests in `src/lib/supabase/student-access.test.mjs`.
- The quiz-start server-side call in `src/lib/supabase/roles.js`.
- Package scripts and dependencies in `package.json`.

## 4. Design

The access policy is a pure function, so authorization behavior can be tested without Supabase or browser setup.

The policy matrix is:

| Role | Status | Resource | Result |
|---|---|---|---|
| Student | Active | Account/profile/results | Allowed |
| Student | Active | Quiz start | Allowed |
| Student | Deactivated | Account/profile/results | Allowed |
| Student | Deactivated | Quiz start | Denied |
| Student | Suspended/unknown | Any defined resource | Undecided |
| Non-student/unknown role | Any | Any student resource | Denied |
| Student | Active/deactivated | Unknown resource | Denied |

Malformed policy context should not produce an authorization exception.

## 5. Planned implementation artifact

Added this script to `package.json`:

```json
"test": "node --test src/lib/supabase/*.test.mjs"
```

Added tests covering:

- Missing and malformed context.
- `null` and `undefined` role/status values.
- Unknown role names.
- Unknown resources.
- All deactivated student resources.
- Suspended or future account states.

Updated `canAccessStudentResource` so context has a safe default and is validated before property access:

```js
export function canAccessStudentResource(resource, context = {}) {
  if (!context || typeof context !== "object") return false;

  const { role, status } = context;
  // Existing policy behavior remains unchanged.
}
```

## 6. Review notes

### What AI got right

- Identified an existing, isolated policy module.
- Kept authorization logic separate from UI code.
- Preserved `true`, `false`, and `null` semantics.
- Kept the task small enough for repeatable verification.

### What should be changed manually

- Add malformed-context tests rather than only happy-path examples.
- Add a standard test script to `package.json`.
- Use the same test runner already available with Node: `node --test`.

### What was rejected

- Adding authorization checks directly to React components.
- Treating unknown or suspended statuses as denied instead of undecided.
- Replacing `null` with `false`.
- Adding database migrations or UI changes.
- Combining this task with the unfinished quiz implementation.

### Review concern

The original policy destructured its second argument directly. Malformed or missing context could therefore throw instead of fail safely. The implementation now validates the context and returns `false` for non-object values.

## 7. Tests and verification evidence

The repository now includes a standard test script and expanded policy tests.

The smallest verification commands are:

```bash
npm test
npm run lint
npm run build
```

Verification evidence:

- `npm test`: passed 9/9 tests in approximately 220 ms.
- `npm run build`: passed; Next.js 16.4.6 compiled successfully and generated 12 pages.
- `npm run lint`: blocked by one pre-existing, unrelated lint error in
  `src/app/admin/students/student-profile-editor.js:29` for an unescaped apostrophe.
- The malformed-context test passed for `undefined`, `null`, boolean, string, and number contexts.

The lint failure is outside this capstone change and was not modified.

## 8. Shipping and handoff

### Risks

- This policy is used for server-side quiz authorization.
- An incorrect default or role/status check could block valid students or grant access unexpectedly.
- Unknown states should remain undecided until product requirements define them.

### Rollback

- Revert only `package.json` and the policy test/implementation files changed for this task.
- No database migration or data change is required.
- No UI rollback is needed.

### Next steps

1. Commit and push this tested change.
2. Decide whether to fix the unrelated lint violation in the profile editor.
3. Add route-level integration tests after quiz start actions exist.
4. Document the policy matrix in the project README or product specification.
