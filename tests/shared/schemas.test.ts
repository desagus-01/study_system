import { describe, expect, it } from "vitest";

import { SystemStatusSchema } from "../../src/shared/schemas";

describe("SystemStatusSchema", () => {
  it("accepts a complete status response", () => {
    expect(
      SystemStatusSchema.parse({
        electron: "ready",
        preload: "ready",
        sqlite: "ready",
        pi: "available"
      })
    ).toEqual({
      electron: "ready",
      preload: "ready",
      sqlite: "ready",
      pi: "available"
    });
  });

  it("rejects invalid status values", () => {
    expect(() =>
      SystemStatusSchema.parse({
        electron: "ready",
        preload: "ready",
        sqlite: "not ready",
        pi: "available"
      })
    ).toThrow();
  });
});
