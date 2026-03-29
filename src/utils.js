/** Fecha del evento (YYYY-MM-DD). Cambia solo aquí para alinear copy, cuenta atrás y calendario. */
export const WEDDING_DATE = "2026-04-30";

/** Zona horaria del lugar del evento (Chile). */
export const EVENT_TIMEZONE = "America/Santiago";

/** Hora local de inicio de la celebración (cuenta atrás hasta este instante). */
const WEDDING_TARGET_HOUR = 19;

function getWeddingTargetMs() {
  const [y, mon, day] = WEDDING_DATE.split("-").map(Number);
  const start = Date.UTC(y, mon - 1, day - 1, 0, 0, 0);
  const end = Date.UTC(y, mon - 1, day + 2, 0, 0, 0);
  for (let utcMs = start; utcMs < end; utcMs += 60_000) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: EVENT_TIMEZONE,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date(utcMs));
    const get = (type) => Number(parts.find((p) => p.type === type)?.value);
    if (
      get("year") === y &&
      get("month") === mon &&
      get("day") === day &&
      get("hour") === WEDDING_TARGET_HOUR &&
      get("minute") === 0
    ) {
      return utcMs;
    }
  }
  return Date.UTC(y, mon - 1, day, 12, 0, 0);
}

const WEDDING_TARGET_MS = getWeddingTargetMs();

function weddingDateAtEventNoon() {
  const [y, m, d] = WEDDING_DATE.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Fecha corta para hero, lugar y programa: "30 de Abril de 2026". */
export function formatWeddingDateShort() {
  const wed = weddingDateAtEventNoon();
  const day = wed.toLocaleDateString("es-ES", { day: "numeric", timeZone: EVENT_TIMEZONE });
  const month = wed.toLocaleDateString("es-ES", { month: "long", timeZone: EVENT_TIMEZONE });
  const year = wed.toLocaleDateString("es-ES", { year: "numeric", timeZone: EVENT_TIMEZONE });
  const cap = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} de ${cap} de ${year}`;
}

/** Subtítulo de la cuenta atrás: "Hasta el 30 de Abril de 2026". */
export function countdownUntilLabel() {
  return `Hasta el ${formatWeddingDateShort()}`;
}

export function calcCountdownParts() {
  let diff = WEDDING_TARGET_MS - Date.now();
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1e3 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1e3 / 60) % 60);
  return { days, hours, minutes };
}

/** Fecha larga con día de la semana (RSVP / confirmación). */
export function formatWeddingDate() {
  return weddingDateAtEventNoon().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  });
}

export function calendarUrl() {
  const wed = WEDDING_DATE.replace(/-/g, "");
  const [y, m, d] = WEDDING_DATE.split("-").map(Number);
  const end = new Date(Date.UTC(y, m - 1, d + 1));
  const endDay = `${end.getUTCFullYear()}${String(end.getUTCMonth() + 1).padStart(2, "0")}${String(end.getUTCDate()).padStart(2, "0")}`;
  const title = encodeURIComponent("Boda Andrea & Jorge");
  const loc = encodeURIComponent("Colombia 7664, Salón de eventos, La Florida, Región Metropolitana, Chile");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${wed}T190000/${endDay}T000000&location=${loc}&details=${encodeURIComponent("Celebración 19:00 – 00:00 hrs")}`;
}
