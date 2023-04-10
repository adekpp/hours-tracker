export function getFirstNonZeroDigit(dateString: string): string {
    const firstDigit = dateString[0];
    const secondDigit = dateString[1];
  
    if (firstDigit !== '0') {
      return firstDigit + secondDigit;
    } else {
      return secondDigit;
    }
  }
  