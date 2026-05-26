import { describe, expect, it } from "vitest";
import { validateAlbumId, validateDate } from "./validators";

// test the validateAlbumId function
describe("validateAlbumId", () => {
  it("should return a number for valid album IDs", () => {
    expect(validateAlbumId("123")).toBe(123);
    expect(validateAlbumId("0")).toBe(0);
    expect(validateAlbumId("99999")).toBe(99999);
  });

  it("should return null for invalid album IDs", () => {
    expect(validateAlbumId("-1")).toBeNull(); // negative number
    expect(validateAlbumId("abc")).toBeNull(); // non-numeric string
    expect(validateAlbumId("12.34")).toBeNull(); // decimal number
    expect(validateAlbumId("")).toBeNull(); // empty string
  });
});

// test the validateDate function
describe("validateDate", () => {
  it("should return a Date object for valid date strings", () => {
    expect(validateDate("01/01/2020")).toEqual(new Date(2020, 0, 1));
    expect(validateDate("31-12-1999")).toEqual(new Date(1999, 11, 31));
    expect(validateDate(" 15/08/1947 ")).toEqual(new Date(1947, 7, 15)); // with extra spaces
  });

  it("should return null for invalid date strings", () => {
    expect(validateDate("2020/01/01")).toBeNull(); // wrong format
    expect(validateDate("31/02/2020")).toBeNull(); // invalid date
    expect(validateDate("abc")).toBeNull(); // non-date string
    expect(validateDate("")).toBeNull(); // empty string
    expect(validateDate("30-02-2020")).toBeNull(); // invalid date
  });
});

