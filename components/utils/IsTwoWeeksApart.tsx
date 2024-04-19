function dateToUnixTimestamp(dateString: string): number | null {
    const [day, month, year] = dateString.split('.').map(Number);
    
    // Check if the parsed date components are valid
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        console.error('Invalid date format');
        return null;
    }

    const dateObject: Date = new Date(year, month - 1, day); // Month is zero-indexed

    return Math.floor(dateObject.getTime() / 1000); // Convert milliseconds to seconds
}

export default function IsTwoWeeksApart( dateToCompare: string): boolean {
    if (!dateToCompare) {
        return true;
    }
    
    const currentDate: Date = new Date();
    const dateInUnix: number = Math.floor(currentDate.getTime() / 1000);
    const dateToCompareInUnix: number | null = dateToUnixTimestamp(dateToCompare);
    const twoWeeksInSeconds: number = 2 * 7 * 24 * 60 * 60; // 2 weeks in seconds
    const timeDifferenceInSeconds: number = Math.abs(dateInUnix - dateToCompareInUnix);

    return timeDifferenceInSeconds > twoWeeksInSeconds;
}