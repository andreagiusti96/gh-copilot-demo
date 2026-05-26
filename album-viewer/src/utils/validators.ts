export function validateDate(dateString: string): Date | null {
  // French date format: DD/MM/YYYY or DD-MM-YYYY
  const frenchDateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
  const match = dateString.trim().match(frenchDateRegex);

  if (!match) {
    return null;
  }

  const day = parseInt(match[1]!, 10);
  const month = parseInt(match[2]!, 10);
  const year = parseInt(match[3]!, 10);

  // Validate day, month ranges
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  // Check if date is valid (handles cases like Feb 30)
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return null;
  }

  return date;
}


// function that validates the format of a GUID string.

export function validateAlbumId(albumId: string): number | null {
  const trimmedAlbumId = albumId.trim();

  // Accept only whole, non-negative integers.
  if (!/^\d+$/.test(trimmedAlbumId)) {
    return null;
  }

  const id = parseInt(trimmedAlbumId, 10);
  return id;
}   