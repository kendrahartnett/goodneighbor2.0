const chicagoDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function calendarDate(value: Date) {
  const parts = Object.fromEntries(chicagoDate.formatToParts(value).map(({ type, value }) => [type, Number(value)]));
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function reverificationReview(verifiedAt: Date, now = new Date()) {
  const checked = calendarDate(verifiedAt);
  const year = checked.getUTCFullYear();
  const month = checked.getUTCMonth() + 6;
  const day = Math.min(checked.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  const dueAt = new Date(Date.UTC(year, month, day));
  const daysRemaining = Math.round((dueAt.getTime() - calendarDate(now).getTime()) / 86_400_000);
  return {
    dueAt,
    state: daysRemaining < 0 ? "overdue" : daysRemaining <= 30 ? "due-soon" : "current",
  } as const;
}
