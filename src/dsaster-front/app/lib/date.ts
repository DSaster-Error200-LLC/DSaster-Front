export interface FormattedDate {
  readonly day: string;
  readonly month: string;
  readonly time: string;
}

export function formatEventDate(isoDate: string): FormattedDate {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---", time: "--:--" };
  }

  return {
    day: date.toLocaleDateString("es-ES", {
      day: "2-digit",
      timeZone: "UTC",
    }),
    month: date
      .toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" })
      .replace(".", ""),
    time: date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }),
  };
}
