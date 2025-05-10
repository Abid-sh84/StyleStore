/**
 * Validates if a string is a properly formatted UUID v4
 * @param uuid The string to validate
 * @returns boolean indicating if the string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Optional: Add more validation helpers as needed
export function validateOrderItems(items: any[]) {
  // Additional validation logic if needed
}