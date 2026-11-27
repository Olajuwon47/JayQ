const STUDENT_AREAS_AVAILABLE_WHEN_DEACTIVATED = new Set([
  "account",
  "profile",
  "results",
]);

export function canAccessStudentResource(resource, { role, status }) {
  if (role !== "student") return false;

  // Only active and deactivated are currently defined. Leave other states undecided.
  if (status !== "active" && status !== "deactivated") return null;

  if (STUDENT_AREAS_AVAILABLE_WHEN_DEACTIVATED.has(resource)) return true;
  if (resource === "quiz-start") return status === "active";

  return false;
}