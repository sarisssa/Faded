import { getYears } from "./getYears";

describe("getYears", () => {
  it("retrieves years from start to end year by default", () => {
    const startYear = 2020;
    const endYear = 2020;

    const years = getYears(startYear, endYear);

    expect(years).toStrictEqual([2020]);
  });

  it("should throw an error if startYear is greater than endYear", () => {
    const startYear = 2025;
    const endYear = 2020;

    const yearsFn = () => getYears(startYear, endYear);

    expect(yearsFn).toThrow("startYear cannot be greater than endYear");
  });

  it("should return years starting from 1970", () => {
    const endYear = 1972;

    const years = getYears(undefined, endYear);

    expect(years).toEqual([1970, 1971, 1972]);
  });
});
