import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { openDatabase } from "../../src/main/database";
import {
  createConcept,
  createCourse,
  createRelationship,
  createSource,
  createSourceSegment,
  listConceptVersions,
  listCourses,
  listRelationshipVersions,
  listSourceSegments,
  listSources,
  updateConcept,
  updateRelationship
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
  it("creates immutable concept versions and advances the current version", () => {
    const database = openTestDatabase();
    const course = createCourse(database, { title: "Mathematics" });
    const concept = createConcept(database, {
      courseId: course.id,
      kind: "principle",
      canonicalLabel: "Derivative",
      title: "Derivative as rate of change",
      userDefinition: "The instantaneous rate at which a quantity changes.",
      importance: 4
    });
    const updatedVersion = updateConcept(database, concept.id, {
      title: "Derivative as local linear change",
      scope: "Single-variable functions",
      importance: 5
    });

    expect(listConceptVersions(database, concept.id)).toEqual([
      expect.objectContaining({
        id: concept.currentVersionId,
        title: "Derivative as rate of change",
        supersedesId: null,
        importance: 4
      }),
      updatedVersion
    ]);
    expect(
      database
        .prepare("SELECT current_version_id AS currentVersionId FROM concepts WHERE id = ?")
        .get(concept.id)
    ).toEqual({ currentVersionId: updatedVersion.id });

    database.close();
  });

  it("rejects invalid concept payloads and updates to missing concepts", () => {
    const database = openTestDatabase();
    const course = createCourse(database, { title: "Chemistry" });

    expect(() =>
      createConcept(database, {
        courseId: course.id,
        kind: "invalid",
        canonicalLabel: "Atom",
        title: "Atom"
      })
    ).toThrow();
    expect(() =>
      updateConcept(database, "c2223a7f-c5a4-4793-b0e0-5163407f3d6c", {
        title: "Missing concept"
      })
    ).toThrow("Concept not found.");

    database.close();
  });

  it("creates immutable proposition-labelled relationship versions", () => {
    const database = openTestDatabase();
    const course = createCourse(database, { title: "Physics" });
    const force = createConcept(database, {
      courseId: course.id,
      kind: "concept",
      canonicalLabel: "Force",
      title: "Force"
    });
    const acceleration = createConcept(database, {
      courseId: course.id,
      kind: "concept",
      canonicalLabel: "Acceleration",
      title: "Acceleration"
    });
    const relationship = createRelationship(database, {
      courseId: course.id,
      sourceConceptId: force.id,
      targetConceptId: acceleration.id,
      relationType: "causes_or_influences",
      propositionText: "A net force causes acceleration.",
      conditions: { system: "constant mass" },
      importance: 5
    });
    const updatedVersion = updateRelationship(database, relationship.id, {
      propositionText: "A net force produces acceleration inversely proportional to mass.",
      importance: 5
    });

    expect(listRelationshipVersions(database, relationship.id)).toEqual([
      expect.objectContaining({
        id: relationship.currentVersionId,
        propositionText: "A net force causes acceleration.",
        conditions: { system: "constant mass" },
        supersedesId: null
      }),
      updatedVersion
    ]);

    database.close();
  });

  it("rejects invalid relationship propositions and cross-course concepts", () => {
    const database = openTestDatabase();
    const firstCourse = createCourse(database, { title: "Biology" });
    const secondCourse = createCourse(database, { title: "Chemistry" });
    const firstConcept = createConcept(database, {
      courseId: firstCourse.id,
      kind: "concept",
      canonicalLabel: "Cell",
      title: "Cell"
    });
    const secondConcept = createConcept(database, {
      courseId: secondCourse.id,
      kind: "concept",
      canonicalLabel: "Atom",
      title: "Atom"
    });

    expect(() =>
      createRelationship(database, {
        courseId: firstCourse.id,
        sourceConceptId: firstConcept.id,
        targetConceptId: secondConcept.id,
        relationType: "requires",
        propositionText: "Requires an atom."
      })
    ).toThrow("Relationship concepts must belong to its course.");
    expect(() =>
      createRelationship(database, {
        courseId: firstCourse.id,
        sourceConceptId: firstConcept.id,
        targetConceptId: firstConcept.id,
        relationType: "not-a-relation",
        propositionText: "   "
      })
    ).toThrow();

    database.close();
  });

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
