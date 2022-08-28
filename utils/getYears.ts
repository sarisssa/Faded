export const getYears = (
  startYear = 1970,
  endYear = new Date().getFullYear()
) => {
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(startYear++);
  }
  return years;
};
