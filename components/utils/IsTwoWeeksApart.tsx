function dateToUnixTimestamp(dateString: string): number | null {
  // Handle both DD.MM.YYYY and YYYY-MM-DD formats
  let day: number, month: number, year: number;

  if (dateString.includes(".")) {
    // Format: DD.MM.YYYY
    [day, month, year] = dateString.split(".").map(Number);
  } else if (dateString.includes("-")) {
    // Format: YYYY-MM-DD
    [year, month, day] = dateString.split("-").map(Number);
  } else {
    console.error("Invalid date format");
    return null;
  }

  // Check if the parsed date components are valid
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error("Invalid date format");
    return null;
  }

  const dateObject: Date = new Date(year, month - 1, day); // Month is zero-indexed

  return Math.floor(dateObject.getTime() / 1000); // Convert milliseconds to seconds
}

export default function IsTwoWeeksApart(dateToCompare: string): boolean {
  if (!dateToCompare) {
    return true;
  }

  const currentDate: Date = new Date();
  const dateInUnix: number = Math.floor(currentDate.getTime() / 1000);
  const dateToCompareInUnix: number | null = dateToUnixTimestamp(dateToCompare);

  // If date parsing failed, treat as old (don't show "new" badge)
  if (dateToCompareInUnix === null) {
    return true;
  }

  const twoWeeksInSeconds: number = 2 * 7 * 24 * 60 * 60; // 2 weeks in seconds
  const timeDifferenceInSeconds: number = Math.abs(
    dateInUnix - dateToCompareInUnix,
  );

  return timeDifferenceInSeconds > twoWeeksInSeconds;
}
