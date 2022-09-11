export const getYears = (
  startYear = 1970,
  endYear = new Date().getFullYear()
) => {
  if (startYear > endYear)
    throw new Error("startYear cannot be greater than endYear");

  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(startYear++);
  }
  return years;
};
