export function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getStreakStats(activityDays: string[], now: Date) {
  const days = [...new Set(activityDays)].sort();
  const daySet = new Set(days);
  const today = localDateKey(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let current = 0;
  const cursor = daySet.has(today) ? dateFromKey(today) : yesterday;

  for (let offset = 0; daySet.has(localDateKey(new Date(
    cursor.getFullYear(),
    cursor.getMonth(),
    cursor.getDate() - offset,
  ))); offset += 1) {
    current += 1;
  }

  let best = 0;
  let run = 0;
  let previousDay: number | null = null;
  for (const key of days) {
    const [year, month, day] = key.split("-").map(Number);
    const dayNumber = Date.UTC(year, month - 1, day) / (24 * 60 * 60 * 1000);
    if (previousDay !== null && dayNumber - previousDay === 1) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    previousDay = dayNumber;
  }

  return { current, best, activeToday: daySet.has(today) };
}
