import { expect, it } from "vitest";
import { sum } from "./app";

it("adds 1 + 2 to equals 3", () => {
  expect(sum(1, 2)).toBe(3);
});
