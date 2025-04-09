export const isOtpExpired = (createdAt: string): boolean => {
    const createdTime = new Date(createdAt).getTime(); // Convert createdAt to timestamp (ms)
    const currentTime = Date.now(); // Get current timestamp (ms)
    
    const differenceInMinutes = (currentTime - createdTime) / (1000 * 60); // Convert to minutes
  
    return differenceInMinutes > 30; // Returns true if more than 30 mins old
  };
  