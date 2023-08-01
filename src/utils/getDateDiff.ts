function getDateDiff(startDate: Date, endDate: Date): number {
  // Calculate the time difference in milliseconds between the two dates
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Convert the time difference to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export default getDateDiff;