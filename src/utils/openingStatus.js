/**
 * Parses opening hours strings or checks if a library is currently open.
 * If status is unknown or format is too complex to determine reliably,
 * returns null (never invent or guess!).
 */
export function getOpeningStatus(openingHoursStr, isOpenNowProp) {
  if (typeof isOpenNowProp === 'boolean') {
    return {
      status: isOpenNowProp ? 'open' : 'closed',
      label: isOpenNowProp ? 'Open now' : 'Closed',
      color: isOpenNowProp ? 'green' : 'red'
    };
  }

  if (!openingHoursStr || typeof openingHoursStr !== 'string') {
    return null;
  }

  const clean = openingHoursStr.trim().toLowerCase();

  if (clean === '24/7' || clean.includes('24/7')) {
    return {
      status: 'open',
      label: 'Open 24/7',
      color: 'green'
    };
  }

  // If opening_hours specifies a simple range like "Mo-Fr 09:00-18:00"
  // We can attempt to parse day and time or simply display opening hours if status is ambiguous
  try {
    const now = new Date();
    const currentDay = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'][now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Check simple patterns: e.g. "Mo-Sa 09:00-18:00"
    const dayRanges = clean.split(';');
    for (const rule of dayRanges) {
      const parts = rule.trim().split(/\s+/);
      if (parts.length >= 2) {
        const daysPart = parts[0].toLowerCase();
        const timePart = parts[1];

        // Check if day matches
        const matchesDay = isDayInRange(currentDay, daysPart);
        if (matchesDay && timePart.includes('-')) {
          const [startStr, endStr] = timePart.split('-');
          const [startH, startM] = startStr.split(':').map(Number);
          const [endH, endM] = endStr.split(':').map(Number);

          const startMinutes = startH * 60 + (startM || 0);
          const endMinutes = endH * 60 + (endM || 0);

          if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
            return {
              status: 'open',
              label: 'Open now',
              color: 'green'
            };
          } else {
            return {
              status: 'closed',
              label: 'Closed',
              color: 'red'
            };
          }
        }
      }
    }
  } catch (e) {
    // If parsing fails, do NOT guess. Return null.
    return null;
  }

  return null;
}

function isDayInRange(targetDay, dayRange) {
  const days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
  if (dayRange.includes(targetDay)) return true;

  if (dayRange.includes('-')) {
    const [start, end] = dayRange.split('-');
    const startIndex = days.indexOf(start.trim());
    const endIndex = days.indexOf(end.trim());

    if (startIndex !== -1 && endIndex !== -1) {
      const targetIndex = days.indexOf(targetDay);
      if (startIndex <= endIndex) {
        return targetIndex >= startIndex && targetIndex <= endIndex;
      } else {
        // Wraps around week (e.g. Fr-Tu)
        return targetIndex >= startIndex || targetIndex <= endIndex;
      }
    }
  }
  return false;
}
