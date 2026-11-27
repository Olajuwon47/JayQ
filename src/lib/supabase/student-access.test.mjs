import assert from "node:assert/strict";
import test from "node:test";
import { canAccessStudentResource } from "./student-access.mjs";

test("active students can access account, profile, results, and quiz start", () => {
  for (const resource of ["account", "profile", "results", "quiz-start"]) {
    assert.equal(
      canAccessStudentResource(resource, { role: "student", status: "active" }),
      true,
      resource,
    );
  }
});

test("deactivated students retain account, profile, and result access", () => {
  for (const resource of ["account", "profile", "results"]) {
    assert.equal(
      canAccessStudentResource(resource, { role: "student", status: "deactivated" }),
      true,
      resource,
    );
  }
});

test("deactivated students cannot start a quiz", () => {
  assert.equal(
    canAccessStudentResource("quiz-start", { role: "student", status: "deactivated" }),
    false,
  );
});

test("non-students cannot access student resources", () => {
  assert.equal(
    canAccessStudentResource("account", { role: "admin", status: "active" }),
    false,
  );
  assert.equal(
    canAccessStudentResource("quiz-start", { role: "admin", status: "active" }),
    false,
  );
});

test("unconfigured account states remain undecided", () => {
  for (const resource of ["account", "profile", "results", "quiz-start"]) {
    assert.equal(
      canAccessStudentResource(resource, { role: "student", status: "suspended" }),
      null,
      resource,
    );
  }
});

test("unknown resources are denied", () => {
  assert.equal(
    canAccessStudentResource("admin-settings", { role: "student", status: "active" }),
    false,
  );
});