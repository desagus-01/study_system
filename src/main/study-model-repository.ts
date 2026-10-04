import { randomUUID } from "node:crypto";

import type Database from "better-sqlite3";

import {
  CourseCreateSchema,
  SourceCreateSchema,
  SourceSegmentCreateSchema
} from "../shared/schemas";
import type { SourceType } from "../shared/types";

export interface Course {
  id: string;
  title: string;
  createdAt: string;
}

export interface Source {
  id: string;
  courseId: string;
  title: string;
  sourceType: SourceType;
  createdAt: string;
}

export interface SourceSegment {
  id: string;
  sourceId: string;
  ordinal: number;
  content: string;
  locationLabel: string | null;
  createdAt: string;
}

export function createCourse(database: Database.Database, input: unknown): Course {
  const values = CourseCreateSchema.parse(input);
  const course: Course = {
    id: randomUUID(),
    title: values.title,
    createdAt: new Date().toISOString()
  };

  database
    .prepare("INSERT INTO courses (id, title, created_at) VALUES (?, ?, ?)")
    .run(course.id, course.title, course.createdAt);

  return course;
}

export function listCourses(database: Database.Database): Course[] {
  return database
    .prepare("SELECT id, title, created_at AS createdAt FROM courses ORDER BY created_at, id")
    .all() as Course[];
}

export function createSource(database: Database.Database, input: unknown): Source {
  const values = SourceCreateSchema.parse(input);
  const source: Source = {
    id: randomUUID(),
    courseId: values.courseId,
    title: values.title,
    sourceType: values.sourceType,
    createdAt: new Date().toISOString()
  };

  database
    .prepare(
      "INSERT INTO sources (id, course_id, title, source_type, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .run(source.id, source.courseId, source.title, source.sourceType, source.createdAt);

  return source;
}

export function listSources(database: Database.Database, courseId: string): Source[] {
  return database
    .prepare(
      "SELECT id, course_id AS courseId, title, source_type AS sourceType, created_at AS createdAt FROM sources WHERE course_id = ? ORDER BY created_at, id"
    )
    .all(courseId) as Source[];
}

export function createSourceSegment(
  database: Database.Database,
  input: unknown
): SourceSegment {
  const values = SourceSegmentCreateSchema.parse(input);
  const sourceSegment: SourceSegment = {
    id: randomUUID(),
    sourceId: values.sourceId,
    ordinal: values.ordinal,
    content: values.content,
    locationLabel: values.locationLabel ?? null,
    createdAt: new Date().toISOString()
  };

  database
    .prepare(
      "INSERT INTO source_segments (id, source_id, ordinal, content, location_label, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(
      sourceSegment.id,
      sourceSegment.sourceId,
      sourceSegment.ordinal,
      sourceSegment.content,
      sourceSegment.locationLabel,
      sourceSegment.createdAt
    );

  return sourceSegment;
}

export function listSourceSegments(
  database: Database.Database,
  sourceId: string
): SourceSegment[] {
  return database
    .prepare(
      "SELECT id, source_id AS sourceId, ordinal, content, location_label AS locationLabel, created_at AS createdAt FROM source_segments WHERE source_id = ? ORDER BY ordinal"
    )
    .all(sourceId) as SourceSegment[];
}
