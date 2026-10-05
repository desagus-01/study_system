import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { openDatabase } from "../../src/main/database";
import { createStudyModelHandlers } from "../../src/main/study-model-ipc";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

function createHandlers() {
  const directory = mkdtempSync(join(tmpdir(), "pi-learn-"));
  temporaryDirectories.push(directory);
  return createStudyModelHandlers(openDatabase(join(directory, "pi-learn.sqlite")));
}

describe("study model IPC handlers", () => {
  it("validates renderer input before creating canonical records", () => {
    const handlers = createHandlers();

    expect(() => handlers.createCourse({ title: "   " })).toThrow();
    expect(() => handlers.listSources("not-a-uuid")).toThrow();
    expect(() => handlers.listEvidenceRefs("not-an-entity", randomUUID())).toThrow();
  });

  it("exposes explicit course and concept operations without database access", () => {
    const handlers = createHandlers();
    const course = handlers.createCourse({ title: "Statistics" });
    const concept = handlers.createConcept({
      courseId: course.id,
      kind: "concept",
      canonicalLabel: "Mean",
      title: "Mean"
    });

    expect(handlers.listCourses()).toEqual([course]);
    expect(handlers.listConceptVersions(concept.id)).toHaveLength(1);
  });
});
