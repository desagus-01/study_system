import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { openDatabase } from "../../src/main/database";
import {
  createCourse,
  createSource,
  createSourceSegment,
  listCourses,
  listSourceSegments,
  listSources
} from "../../src/main/study-model-repository";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

function openTestDatabase() {
  const directory = mkdtempSync(join(tmpdir(), "pi-learn-"));
  temporaryDirectories.push(directory);
  return openDatabase(join(directory, "pi-learn.sqlite"));
}

describe("study model repository", () => {
  it("persists courses, sources and ordered source segments", () => {
    const database = openTestDatabase();
    const course = createCourse(database, { title: "Biology" });
    const source = createSource(database, {
      courseId: course.id,
      title: "Cell structure",
      sourceType: "document"
    });
    const secondSegment = createSourceSegment(database, {
      sourceId: source.id,
      ordinal: 1,
      content: "Cell membranes regulate transport."
    });
    const firstSegment = createSourceSegment(database, {
      sourceId: source.id,
      ordinal: 0,
      content: "Cells are the basic unit of life.",
      locationLabel: "Page 1"
    });

    expect(listCourses(database)).toEqual([course]);
    expect(listSources(database, course.id)).toEqual([source]);
    expect(listSourceSegments(database, source.id)).toEqual([firstSegment, secondSegment]);

    database.close();
  });

  it("rejects invalid payloads and source records without valid parents", () => {
    const database = openTestDatabase();

    expect(() => createCourse(database, { title: "   " })).toThrow();
    expect(() =>
      createSource(database, {
        courseId: "not-a-uuid",
        title: "Invalid source",
        sourceType: "document"
      })
    ).toThrow();
    expect(() =>
      createSource(database, {
        courseId: "d77d7541-1d01-4f11-a54b-3fcd4e2efc13",
        title: "Missing course",
        sourceType: "document"
      })
    ).toThrow(/FOREIGN KEY/);

    database.close();
  });

  it("does not permit duplicate source segment positions", () => {
    const database = openTestDatabase();
    const course = createCourse(database, { title: "Physics" });
    const source = createSource(database, {
      courseId: course.id,
      title: "Motion",
      sourceType: "note"
    });

    createSourceSegment(database, {
      sourceId: source.id,
      ordinal: 0,
      content: "Velocity includes direction."
    });

    expect(() =>
      createSourceSegment(database, {
        sourceId: source.id,
        ordinal: 0,
        content: "Acceleration changes velocity."
      })
    ).toThrow(/UNIQUE/);

    database.close();
  });
});
